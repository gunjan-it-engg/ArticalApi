const express = require("express");
const topic = new express.Router();
const Topic = require("../models/topic");
const auth = require("../middleware/auth");

// save topic
topic.post("/topic", auth, async (req, res) => {
  console.log(req.body);
  const topic = new Topic(req.body);
  try {
    await topic.save();
    res.status(201).send(topic);
  } catch (e) {
    res.status(404).send(e);
  }
});

// get all topics
topic.get("/topic", auth, (req, res) => {
  console.log(req.body);
  Topic.find({})
    .then((topic) => {
      console.log(topic);
      res.send(topic);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

module.exports = topic;
