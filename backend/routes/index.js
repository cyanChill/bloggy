const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", (req, res, next) => {
  return res.json({ message: "Successfully Pinged API." });
});

/* 
  POST
  /login

  GET
  /logout
*/

module.exports = router;
