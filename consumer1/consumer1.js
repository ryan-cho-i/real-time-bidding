const { Kafka, logLevel } = require("kafkajs");

const axios = require("axios");

const mongoose = require("mongoose");
const User = require("./User");

// Replace 'localhost:9092' with your Kafka broker address
const kafka = new Kafka({
  clientId: "my-kafka-app",
  brokers: ["kafka:9092"],
});

// Topic from which messages will be consumed
const topic = "biddingResults";

// Create the first consumer instance with logLevel set to "WARN"
const consumer1 = kafka.consumer({
  groupId: "consumer-group-1",
  logLevel: logLevel.WARN,
});

const consumeMessage = async (consumer) => {
  try {
    // Connect to MongoDB
    await mongoose
      .connect(
        "mongodb+srv://soo:12341@rtb.e20asj4.mongodb.net/?retryWrites=true&w=majority"
      )
      .then(() => console.log("MongoDB Connected"));

    // Connect to the Kafka broker
    await consumer.connect();

    // Subscribe to the Kafka topic
    await consumer.subscribe({ topic: topic });

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ message }) => {
        const { id, ranking } = JSON.parse(message.value);
        console.log(id, ranking);
        const winner = ranking[0];
        const user = await User.findOne({ userId: winner.id });
        console.log(user.cdn);
        await axios.post(`http://client:8080/advertisement`, {
          id: id,
          url: user.cdn,
        });
      },
    });
  } catch (error) {
    console.error("Error consuming message:", error);
  }
};

// Start consuming messages for both consumers
consumeMessage(consumer1);
