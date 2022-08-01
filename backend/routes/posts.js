const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");

/* 
  Require Verification for POST, PUT, & DELETE
    - GET /posts will only return published posts [unless the user is logged in, in which it also returns unpublished posts]

  GET, POST
  /posts

  GET, PUT, DELETE
  /posts/:postId

  GET, POST
  /posts/:postId/comments

  GET, DELETE
  /posts/:postId/comments/:commentId
*/

module.exports = router;
