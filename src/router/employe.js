const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const Employee = require("../models/employe");
const auth = require("../middleware/auth");
const employe = new express.Router();
const EmployeeDetail = require("../models/employe-details");
const Adduser = require("../models/adduser");
const e = require("express");
// Adding Employee details inside app

employe.post("/adduser", async (req, res) => {
  try {
    const { name, lname, email, password, phone } = req.body.data;
    const emp = await new Adduser({
      name,
      lname,
      email,
      password,
      date,
      phone,
    }).save();
    res.status(201).send(emp);
  } catch (error) {
    console.log("Error", error);
    res.status(400).send(error.message);
  }
});

module.exports = employe;
