const mongoose = require("mongoose");

const Topicschema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const Topic = mongoose.model("Topic", Topicschema);

module.exports = Topic;
