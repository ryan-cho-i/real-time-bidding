const express = require("express");
const app = express();
app.use(express.json());

const axios = require("axios");

const Redis = require("ioredis");
const redisClient = new Redis();

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-kafka-app",
  brokers: ["localhost:9092"],
});

const topic = "bidding_results";

const producer = kafka.producer();

async function getBidResponse(url, data) {
  try {
    const response = await axios.get(url, { params: data });

    // Prevent Race Condition using Redis
    const cnt = await redisClient.incr("cnt");

    redisClient
      .multi()
      .zadd(
        "bidResponses",
        response.data.price * 1000 - cnt,
        JSON.stringify({
          id: response.data.id,
          price: response.data.price,
          order: cnt,
        })
      )
      .exec((err, results) => {
        if (err) {
          console.error("Redis Error:", err);
          return;
        }
      });
  } catch (error) {
    console.error("Error making GET request:", error.message);
  }
}

app.post("/bidRequest/:people", async (req, res) => {
  const people = req.params.people;
  redisClient
    .multi()
    .del("bidResponses")
    .set("cnt", 0)
    .exec(async () => {
      const urlList = [];
      for (let i = 0; i < people; i++) {
        urlList.push(`http://localhost:3001/processBid/${i}`);
      }

      try {
        //  Send bid Request Simultaneously
        await Promise.all(urlList.map((url) => getBidResponse(url, {})));

        const ranking = await redisClient
          .zrevrange("bidResponses", 0, -1)
          .then((result) => {
            return result.map((data) => JSON.parse(data));
          });

        console.log(ranking);

        await producer.send({
          topic: topic,
          messages: [{ value: JSON.stringify(ranking) }],
        });

        res.json(ranking);
      } catch (error) {
        console.error("Error in handling bid request:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
});

const PORT = 3000;
app.listen(PORT, async () => {
  await producer.connect();
  console.log(`SSP Server Listening on PORT ${PORT}`);
});
