require("dotenv").config();
const dbConnection = require("./server/config/dbConfig");
const express = require("express");
const cors = require("cors");

const authMiddleware = require("./server/Middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes middleware file
const userRoutes = require("./server/routes/userRoutes");
const questionsRoutes = require("./server/routes/questionRoutes");
const anserRoutes = require("./server/routes/anserRoutes");

// routes middleware
app.use("/api/users", userRoutes);
app.use("/api/questions", authMiddleware, questionsRoutes);
app.use("/api/answers", authMiddleware, anserRoutes);

async function start() {
  try {
    await dbConnection.execute("select 'test'");
    await app.listen();
    console.log("database connected");
    console.log(`Listenimg`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
