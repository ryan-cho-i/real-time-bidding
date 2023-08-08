// npm i dotenv
require("dotenv").config();

const { Kafka, logLevel } = require("kafkajs");

// npm i mongoose
const mongoose = require("mongoose");
const Log = require("./models/Log");

// Replace 'localhost:9092' with your Kafka broker address
const kafka = new Kafka({
  clientId: "my-kafka-app",
  brokers: ["localhost:9092"],
});

// Topic from which messages will be consumed
const topic = "test-topic";

// Create the second consumer instance with logLevel set to "WARN"
const consumer2 = kafka.consumer({
  groupId: "consumer-group-2",
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