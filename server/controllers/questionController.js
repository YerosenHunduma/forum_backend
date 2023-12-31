const dbConnection = require("../config/dbConfig");
const { StatusCodes } = require("http-status-codes");
const uuid = require("uuid");

async function postQuestions(req, res) {
  const { title, description, tag } = req.body;

  if (!title || !description || !tag) {
    return res.status(400).json({ msg: "Please provide all information" });
  }

  try {
    const userid = req.user.userid;
    const questionid = uuid.v4();
    // console.log(questionid);

    await dbConnection.query(
      "INSERT INTO questions (questionid, title, description, tag, userid) VALUES (?, ?, ?, ?, ?)",
      [questionid, title, description, tag, userid]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something wents wrong, please try again later" });
  }
}

async function allQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(
      "SELECT q.title,q.description,q.id ,q.questionid, u.username FROM questions q INNER JOIN users u ON q.userid = u.userid ORDER BY q.id DESC"
    );
    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something wents wrong, please try again later" });
  }
}

async function singleQuestion(req, res) {
  try {
    const questionid = req.params.questionid;
    const [question] = await dbConnection.query(
      "SELECT title, description, tag,questionid FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    return res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something wents wrong, please try again later" });
  }
}

module.exports = { postQuestions, allQuestions, singleQuestion };
