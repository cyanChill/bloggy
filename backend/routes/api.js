const express = require("express");
const router = express.Router();
const passport = require("passport");

const postsRouter = require("../routes/posts");
const apiController = require("../controllers/apiController");

router.get("/", (req, res, next) => {
  return res.json({ message: "Successfully Pinged API." });
});

// Login - POST /api/login
router.post("/login", apiController.loginPost);

// Logout - GET /api/logout
router.get("/logout", apiController.logoutGet);

// Add post routes
router.use("/posts", postsRouter);

/* SignUp - /api/signup */
// const { hashPassword } = require("../helpers/hash");
// const User = require("../models/User");s
// router.post("/signup", async (req, res, next) => {
//   const { username, password } = req.body;
//   const hashed = await hashPassword(password);
//   const user = await User.create({ username: username, password: hashed });
//   res.status(201).json({ message: "Successfully signed up.", user: user });
// });

module.exports = router;
