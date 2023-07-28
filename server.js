// npm init -y
// npm i express
const express = require("express");
const app = express();
app.use(express.json());

// npm i axios
const axios = require("axios");

// npm i ioredis
// redis-server
// redis-cli
const Redis = require("ioredis");
const redisClient = new Redis();

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
