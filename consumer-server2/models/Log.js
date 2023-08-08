const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    result: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("log", LogSchema);
