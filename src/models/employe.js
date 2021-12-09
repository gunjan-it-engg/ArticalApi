const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    phone: {
      type: Number,

      required: true,
      trim: true,
    },
    dob: {
      type: Date,

      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    detail_ref: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "EmployeeDetail",
    },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Employe = mongoose.model("Employe", userSchema);
module.exports = Employe;
