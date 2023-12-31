const express = require("express");

const router = express.Router();
const {
  postAnswer,
  getAllAnswers,
} = require("../controllers/answerController");

router.post("/:questionid", postAnswer);

router.get("/:questionid", getAllAnswers);

module.exports = router;
