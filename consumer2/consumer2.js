const express = require("express");
const app = express();
app.use(express.json());

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

const { PNG } = require("pngjs");

app.get("/firePixel", (req, res) => {
  const width = 10;
  const height = 10;

  let png = new PNG({
    width,
    height,
    filterType: 4,
  });

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      let idx = (png.width * y + x) << 2;

      // Red color
      png.data[idx] = 255;
      png.data[idx + 1] = 0;
      png.data[idx + 2] = 0;
      png.data[idx + 3] = 255;
    }
  }

  res.setHeader("Content-Type", "image/png");
  png.pack().pipe(res);
});

const PORT = 3002;
app.listen(PORT, async () => {
  await producer.connect();
  console.log(`SSP Server Listening on PORT ${PORT}`);
});
