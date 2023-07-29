require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const randomNumberInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

app.get("/processBid/:id", (req, res) => {
  const id = req.params.id;
  setTimeout(() => {
    res.send({
      id: id,
      price: randomNumberInRange(0, 100),
    });
  }, randomNumberInRange(0, 2000));
});

const PORT = process.env.DSP_PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
