//db connection
const dbConnection = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all fields " });
  }

  try {
    // ckecking if the user already registered

    const [user] = await dbConnection.query(
      "SELECT username,userid FROM users WHERE username= ? or email = ?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already exists" });
    }

    // check password length

    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters." });

    // hashing password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // inserting user data into the table

    dbConnection.query(
      "INSERT INTO users( username, firstname, lastname, email, password) VALUES (?,?,?,?,?) ",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "user is registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something wents wrong, please try again later" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all fields " });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password); // Await the comparison

    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    return res.status(StatusCodes.OK).json({
      msg: "User logged in successfully",
      token,
      user: { username, userid },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again later" });
  }
}
function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", user: { username, userid } });
}

module.exports = { register, login, checkUser };
