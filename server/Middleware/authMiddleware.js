const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authorization invalid" });
  }

  const token = authHeader.split(" ")[1];
  // console.log(authHeader);
  // console.log(token);

  try {
    const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);
    // return res.status(StatusCodes.OK).json({ data });
    req.user = { username, userid };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authorization invalid" });
  }
}
module.exports = authMiddleware;
