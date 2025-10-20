require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
