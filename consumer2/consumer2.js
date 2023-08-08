const { Kafka, logLevel } = require("kafkajs");

const mongoose = require("mongoose");
const Log = require("./Log");

// Replace 'localhost:9092' with your Kafka broker address
const kafka = new Kafka({
  clientId: "my-kafka-app",
  brokers: ["kafka:9092"],
});

// Topic from which messages will be consumed
const topic = "biddingResults";

// Create the second consumer instance with logLevel set to "WARN"
const consumer2 = kafka.consumer({
  groupId: "consumer-group-2",
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
        const data = JSON.parse(message.value.toString());
        const winner = data[0];
        console.log("Winner:", winner);
        await new Log({ result: winner }).save();
      },
    });
  } catch (error) {
    console.error("Error consuming message:", error);
  }
};

// Start consuming messages for both consumers
consumeMessage(consumer2);
