const express = require("express");
const user = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

// user registration form

user.post("/users", async (req, res) => {
  try {
    const user = new User(req.body.data);
    console.log("user", user);
    await user.save();
    const token = await user.generateAuthToken();
    console.log(token);
    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

//   getting list of registered user

user.get("/users", async (req, res) => {
  // console.log(req.body);
  try {
    let { page, size } = req.query;
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 3;
    }
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    // const users = await User.find().limit(limit).skip(skip);
    const users = await User.find({}, {}, { limit: limit, skip: skip });
    res.send(users);
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
  // try {
  //   const userList = await User.find();
  //   console.log("user list", userList);
  //   console.log("asdf");
  //   let test = [];
  //   test.push({ ...userList[0] });
  //   // console.log("test", test[0]._doc);
  //   res.send(userList);
  // } catch (e) {
  //   res.send(e);
  // }
});

// User login end-point

user.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.data.email,
      req.body.data.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Logout the user from app

user.post("/users/logout", auth, async (req, res) => {
  try {
    console.log("request arrived");
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    console.log(req.user.tokens);
    await req.user.save();
    res.send("You are logged out");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

//End Point for get use profile
user.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// //End-point for following to the user.
// user.post("/user/follow-user/:user_id", auth, (req, res) => {
//   // check if the requested user and :user_id is same if same then

//   if (req.user.id === req.params.user_id) {
//     return res
//       .status(400)
//       .json({ alreadyfollow: "You cannot follow yourself" });
//   }

//   User.findById(req.params.user_id).then((user) => {
//     // check if the requested user is already in follower list of other user then

//     if (
//       user.followers.filter(
//         (follower) => follower.user.toString() === req.user.id
//       ).length > 0
//     ) {
//       return res
//         .status(400)
//         .json({ alreadyfollow: "You already followed the user" });
//     }

//     user.followers.unshift({ user: req.user.id });
//     user.save();
//     User.findOne({ email: req.user.email })
//       .then((user) => {
//         user.following.unshift({ user: req.params.user_id });
//         user.save().then((user) => res.json(user));
//       })
//       .catch((err) =>
//         res.status(404).json({ alradyfollow: "you already followed the user" })
//       );
//   });
// });

// //End-point for unfollow the user
// user.post("/user/unfollow-user/:user_id", auth, (req, res) => {
//   // check if the requested user and :user_id is same if same then
//   try {
//     if (req.user.id === req.params.user_id) {
//       return res
//         .status(400)
//         .json({ alreadyUnfollow: "You cannot unfollow yourself" });
//     }

//     User.findById(req.params.user_id).then((user) => {
//       // check if the requested user is already in unfollower list of other user then
//       console.log(
//         req.user.following.find(
//           (following) => following.user.toString() === req.params.user_id
//         )
//       );
//       if (
//         !req.user.following.find(
//           (following) => following.user.toString() === req.params.user_id
//         )
//       ) {
//         return res
//           .status(400)
//           .json({ alreadyUnfollow: "You already Unfollowed the user" });
//       } else {
//         req.user.following = req.user.following.filter(
//           (following) => following.user.toString() !== req.params.user_id
//         );
//         req.user.save();

//         user.followers = user.followers.filter(
//           (followers) => followers.user.toString() !== req.user.id
//         );
//         user.save();

//         return res.status(200).json("Successfully unfollowed");
//       }
//     });
//   } catch (error) {
//     return res.status(400).json({ alreadyUnfollow: error });
//   }
// });

module.exports = user;
