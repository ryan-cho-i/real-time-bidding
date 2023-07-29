// npm i dotenv
require("dotenv").config();

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
        urlList.push(
          `http://localhost:${process.env.DSP_PORT}/processBid/${i}`
        );
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
        await axios.post(
          `http://localhost:${process.env.KAFKA_PORT}/send-to-kafka/`,
          {
            ranking,
          }
        );
        res.json(ranking);
      } catch (error) {
        console.error("Error in handling bid request:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
});

const PORT = process.env.SSP_PORT;
app.listen(PORT, () => {
  console.log(`SSP Server Listening on PORT ${PORT}`);
});
