const passport = require("passport");
const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");

/* Get all posts - GET /api/posts */
router.get("/", postsController.postsGet);
/* Submit a post if verified - POST /api/posts */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postsController.postsPost
);

/* Get single post - GET /api/posts/:postId */
router.get("/:postId", postsController.postGet);
/* Update single post - POST /api/posts/:postId */
router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postsController.postPut
);
/* Delete single post - DELETE /api/posts/:postId */
router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postsController.postDelete
);

/* Get all comments for a post - GET /api/posts/:postId/comments */
router.get("/:postId/comments", postsController.postCommentsGet);
/* Submit a comment - POST /api/posts/:postId/comments */
router.post("/:postId/comments", postsController.postCommentsPost);

/* Delete a comment - DELETE /api/posts/:postId/comments/:commentId */
router.delete(
  "/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  postsController.postCommentDelete
);

module.exports = router;
