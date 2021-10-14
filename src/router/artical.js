const express = require("express");
const artical = new express.Router();
const Artical = require("../models/artical");
const auth = require("../middleware/auth");
const Topic = require("../models/topic");

// send artical
artical.post("/artical", auth, async (req, res) => {
  // console.log(req.body);
  // const task = new Task(req.body);
  const topic = await Topic.findOne({ topic: req.body.topic });
  // console.log("dfssadffsadfsaf", topic._id);
  if (topic == null) {
    return res.status(404).send("Topic not found");
  }
  const artical = new Artical({
    ...req.body,
    topic: topic,
    owner: req.user.id,
  });
  try {
    await artical.save();

    res.status(201).send({
      id: artical._id,
      title: artical.title,
      topic: artical.topic.topic,
      description: artical.description,
    });
  } catch (e) {
    res.status(404).send(e);
  }
});

// get list of articals
artical.get("/articals", auth, (req, res) => {
  console.log(req.body);
  Artical.find({})
    .then((artical) => {
      console.log(artical);
      res.send(artical);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

// getting a particular task of the user
artical.get("/artical", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const artical = await Artical.findOne({ owner: req.user._id });
    if (!artical) {
      return res.status(404).send();
    }
    res.send(artical);
  } catch (e) {
    res.status(500).send();
  }
});

// Update a particular articals by id of the artical
artical.patch("/artical/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "topic"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const artical = await Artical.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    updates.forEach((update) => (artical[update] = req.body[update]));
    await artical.save();
    if (!artical) {
      return res.status(404).send();
    }
    res.send(artical);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete the artical by id
artical.delete("/artical/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const artical = await Artical.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!artical) {
      return res.status(404).send();
    }
    res.send(artical);
  } catch (e) {
    res.status(500).send();
  }
});

// Following to the user and get the topics
artical.get("/artical/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const artical = await Artical.find({ owner: _id });

    if (!artical) {
      return res.status(404).send();
    }
    res.send(artical);
  } catch (e) {
    res.status(500).send();
  }
});

// Get artical by topic
artical.get("/articalss/", auth, async (req, res) => {
  const _topic = req.query.topic;
  //   console.log(req.params.category);
  console.log("params is : ", _topic);
  try {
    const artical = await Artical.find({ topic: _topic });
    if (!artical) {
      return res.status(404).send("Article not exist");
    }

    res.send(artical);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Get most recent articals
artical.post("/artical/mostrecent", auth, async (req, res) => {
  try {
    const article = await Artical.aggregate([
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.status(200).send(article[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Adding an Comment on the artical
artical.post("/artical/comment", auth, async (req, res) => {
  try {
    // console.log(req.body);
    // const { comment, _id } = req.body;
    const { _id, description } = req.body;
    const comment = {
      description,
      userId: req.user._id,
    };
    console.log(comment);
    const article = await Artical.findOneAndUpdate(
      { _id },
      // { $push: { comments: comment } },
      { $push: { comments: comment } },
      { new: true }
    );
    res.status(200).send(article);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = artical;
