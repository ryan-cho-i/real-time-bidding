const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    cdn: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
