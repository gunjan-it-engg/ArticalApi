const express = require("express");
const UserRouter = require("./router/user");
const ArticalRouter = require("./router/artical");
const TopicRouter = require("./router/topic");
// mongodb setup
require("./db/mongoose");
//set up app
const app = express();
//setting up port
const port = 3000;

app.use(express.json());
// using user router in app
app.use(UserRouter);
// using artical router in app
app.use(ArticalRouter);
// using topic router in app
app.use(TopicRouter);
//default path setup
app.get("/", (req, res) => {
  res.send("This is the homepage of Artical-Rest-Api");
});

app.listen(port, () => {
  console.log("server is on the" + port);
});
