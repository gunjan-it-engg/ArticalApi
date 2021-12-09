const express = require("express");
const UserRouter = require("./router/user");
const Employe = require("./router/employe");
// const ArticalRouter = require("./router/artical");
// const TopicRouter = require("./router/topic");
// mongodb setup
require("./db/mongoose");
//set up app
const cors = require("cors");
const app = express();
//setting up port

app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
app.use(express.json());
// using the employe router in app

app.use("/emp", Employe);
// using user router in app
app.use(UserRouter);

// app.get("/", (req, res) => {
//   res.send("This is the homepage of Artical-Rest-Api");
// });
const port = 8000;
app.listen(port, () => {
  console.log("server is on the" + port);
});
