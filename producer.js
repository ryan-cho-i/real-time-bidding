// npm i express
const express = require("express");
const app = express();
app.use(express.json());

// npm i kafkajs
// bin/zookeeper-server-start.sh config/zookeeper.properties
// bin/kafka-server-start.sh config/server.properties
// bin/kafka-topics.sh --create --topic test-topic --bootstrap-server=localhost:9092
// bin/kafka-topics.sh --list --bootstrap-server localhost:9092
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-kafka-app",
  brokers: ["localhost:9092"],
});

const topic = "test-topic";

const producer = kafka.producer();

app.post("/send-to-kafka", async (req, res) => {
  try {
    const message = req.body;

    console.log(message);

    await producer.connect();

    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log("Message sent to Kafka:", message);
    res
      .status(200)
      .json({ status: "success", message: "Message sent to Kafka" });
  } catch (error) {
    console.error("Error sending message to Kafka:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to send message to Kafka" });
  } finally {
    producer.disconnect();
  }
});

// KAFKAJS_NO_PARTITIONER_WARNING=1 node producer.js
const PORT = process.env.KAFKA_PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
