// npm i dotenv
require("dotenv").config();

const { Kafka, logLevel } = require("kafkajs");

const axios = require("axios");

// npm i mongoose
const mongoose = require("mongoose");
const User = require("./models/User");

// Replace 'localhost:9092' with your Kafka broker address
const kafka = new Kafka({
  clientId: "my-kafka-app",
  brokers: ["localhost:9092"],
});

// Topic from which messages will be consumed
const topic = "test-topic";

// Create the first consumer instance with logLevel set to "WARN"
const consumer1 = kafka.consumer({
  groupId: "consumer-group-1",
  logLevel: logLevel.WARN,
});

const consumeMessage = async (consumer) => {
  try {
    // Connect to MongoDB
    await mongoose
      .connect(process.env.MONGO_URI)
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
        const user = await User.findOne({ userId: winner.id });
        console.log(user.cdn);
        await axios.post(
          `http://localhost:${process.env.CLIENT_PORT}/advertisement`,
          { url: user.cdn }
        );
      },
    });
  } catch (error) {
    console.error("Error consuming message:", error);
  }
};

// Start consuming messages for both consumers
consumeMessage(consumer1);
