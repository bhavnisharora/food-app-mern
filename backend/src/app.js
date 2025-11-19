// create server
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes"); //for registerting in the server

const app = express();

app.use(cookieParser());
app.use(express.json()); // when you getting request from frontend you have to call this else server will get nothing

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRoutes); //add the prefix before the API

module.exports = app;
