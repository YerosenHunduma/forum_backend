require("dotenv").config();
const mysql = require("mysql2");
const dbConnection = mysql.createPool({
  host: process.env.DataBase,
  user: process.env.DB_USER,
  database: process.env.MY_DB,
  password: process.env.PASS,
  connectionLimit: 10,
});

let users = `CREATE TABLE IF NOT EXISTS users(
    userid INT(20) NOT NULL AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    PRIMARY KEY(userid)
)`;

let questions = `CREATE TABLE IF NOT EXISTS questions(
    id INT(20) NOT NULL AUTO_INCREMENT,
    questionid VARCHAR(100) NOT NULL UNIQUE,
    userid INT(20) NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    tag VARCHAR(20),
    PRIMARY KEY(id, questionid),
    FOREIGN KEY(userid) REFERENCES users(userid))`;

let answers = `CREATE TABLE IF NOT EXISTS answers (
    answerid INT(30) NOT NULL AUTO_INCREMENT,
    userid INT(20) NOT NULL,
    questionid VARCHAR(100) NOT NULL,
    answer VARCHAR(200) NOT NULL,
    PRIMARY KEY(answerid),
    FOREIGN KEY(questionid) REFERENCES questions(questionid),
    FOREIGN KEY(userid) REFERENCES users(userid))`;

dbConnection.query(users, (err, results) => {
  if (err) {
    console.error("Error creating users table:", err);
  } else {
    console.log("users table created");
  }
});

dbConnection.query(questions, (err, results) => {
  if (err) throw err;
  console.log("questions table created");
});

dbConnection.query(answers, (err, results) => {
  if (err) throw err;
  console.log("answers table created");
});

module.exports = dbConnection.promise();
