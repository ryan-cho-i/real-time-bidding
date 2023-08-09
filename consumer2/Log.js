const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    winner: { type: Object, required: true },
    firePixel: { type: String, required: true },
    click: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("log", LogSchema);
