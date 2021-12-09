const mongoose = require("mongoose");

const empDetailSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    // phone: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    salary: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeDetail = mongoose.model("EmployeeDetail", empDetailSchema);
module.exports = EmployeeDetail;
