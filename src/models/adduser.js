const mongoose = require("mongoose");

const AdduserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Adduser = mongoose.model("AdduserDetail", AdduserSchema);
module.exports = Adduser;
