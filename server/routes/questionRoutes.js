const express = require("express");

const router = express.Router();

const {
  postQuestions,
  allQuestions,
  singleQuestion,
} = require("../controllers/questionController");

router.get("/", allQuestions);

router.post("/ask", postQuestions);

router.get("/:questionid", singleQuestion);

module.exports = router;
