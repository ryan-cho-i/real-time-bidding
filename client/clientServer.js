require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const WebSocket = require("ws"); // Import the WebSocket library
const wss = new WebSocket.Server({ port: 8080 }); // You can use any available port

// Broadcast data to all connected clients
function broadcastData(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

const axios = require("axios");

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "client.html"));
  await axios.post(
    `http://localhost:${process.env.SSP_PORT}/bidRequest/10`,
    {}
  );
});

app.post("/advertisement", async (req, res) => {
  broadcastData(req.body.url);
  res.send({ result: req.body.url });
});

const PORT = process.env.CLIENT_PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
