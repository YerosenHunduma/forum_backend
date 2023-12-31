const express = require("express");

const router = express.Router();

// authentication middleware
const authMiddleware = require("../Middleware/authMiddleware");

// user controllers
const { register, login, checkUser } = require("../controllers/userController");
// register routes
router.post("/register", register);

// login routes
router.post("/login", login);

// check user routes
router.get("/check", authMiddleware, checkUser);
module.exports = router;
