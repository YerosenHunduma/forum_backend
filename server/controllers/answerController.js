const dbConnection = require("../config/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function postAnswer(req, res) {
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ msg: "please complete the answer" });
  }
  try {
    const userid = req.user.userid;
    const questionid = req.params.questionid;
    await dbConnection.query(
      "INSERT INTO answers(questionid, answer, userid) VALUES (?, ?, ?)",
      [questionid, answer, userid]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something wents wrong, please try again later" });
  }
}
async function getAllAnswers(req, res) {
  try {
    const questionid = req.params.questionid;
    const [answers] = await dbConnection.query(
      "SELECT answers.*, users.username as username FROM answers JOIN users ON answers.userid = users.userid WHERE answers.questionid = ?",
      [questionid]
    );
    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something wents wrong, please try again later" });
  }
}

module.exports = { postAnswer, getAllAnswers };
