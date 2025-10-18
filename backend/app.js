require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const streakRoutes = require("./routes/streak.routes");

const corsOptions = {
  origin: ["https://mytodo-inky.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/streak", streakRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
