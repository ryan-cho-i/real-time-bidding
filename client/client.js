const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });

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
  await axios.post(`http://ssp:3000/bidRequest/10`, {});
});

app.post("/advertisement", async (req, res) => {
  broadcastData({ id: req.body.id, url: req.body.url });
  console.log({ id: req.body.id, url: req.body.url });
  res.send({ id: req.body.id, url: req.body.url });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
