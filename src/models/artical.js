const mongoose = require("mongoose");

const Articalschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    completed: {
      type: String,
    },
    // comment: [{ type: String, default: 0 }],
    comments: [
      {
        description: {
          type: String,
          trim: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Artical = mongoose.model("Artical", Articalschema);

module.exports = Artical;
