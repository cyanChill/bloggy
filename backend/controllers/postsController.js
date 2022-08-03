const { body, validationResult } = require("express-validator");

const Comment = require("../models/Comment");
const Post = require("../models/Post");

const { isVerified } = require("../helpers/jwt");

exports.postsGet = async (req, res, next) => {
  const isVerifiedUser = await isVerified(req);
  try {
    // Get all published posts & sort by date
    const [pubPosts, unpubPosts] = await Promise.all([
      Post.find({ published: true }).sort({ date: -1 }).populate("author"),
      Post.find({ published: false }).sort({ date: -1 }).populate("author"),
    ]);

    return res.status(200).json({
      message: "Posts found.",
      posts: pubPosts,
      unpublishedPosts: isVerifiedUser ? unpubPosts : [],
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong when fetching posts.",
    });
  }
};

exports.postsPost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add a title to your post!"),
  body("thumbnailUrl")
    .trim()
    .isURL()
    .withMessage("Add a thumbnail url to your post!"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add content to your blog post!"),

  async (req, res, next) => {
    const errors = validationResult(req);
    let newPostBody = {
      author: req.user._id,
      published: req.body.published,
      title: req.body.title,
      thumbnailUrl: req.body.thumbnailUrl,
      content: req.body.content,
    };
    // Special update value
    if (req.body.published) newPostBody.date = Date.now();

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "There was some errors with your submission",
        errors: errors.array(),
        data: newPostBody,
      });
    }

    try {
      const newPost = await Post.create(newPostBody);
      return res.status(201).json({
        message: "Successfully created post.",
        post: newPost,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when submitting.",
        data: newPostBody,
      });
    }
  },
];

exports.postGet = async (req, res, next) => {
  const isVerifiedUser = await isVerified(req);
  try {
    const post = await Post.findById(req.params.postId);
    // Require authentication to access unpublished posts
    if (post.published === false && !isVerifiedUser) {
      return res.status(401).json({
        message: "User does not have access to this post.",
      });
    }

    return res.status(200).json({
      message: "Successfully found post.",
      post: post,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when fetching post.",
    });
  }
};

exports.postPut = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add a title to your post!"),
  body("thumbnailUrl")
    .trim()
    .isURL()
    .withMessage("Add a thumbnail url to your post!"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add content to your blog post!"),

  async (req, res, next) => {
    const errors = validationResult(req);
    let updatedPostBody = {
      published: req.body.published,
      title: req.body.title,
      thumbnailUrl: req.body.thumbnailUrl,
      content: req.body.content,
    };
    let oldPostData;
    try {
      oldPostData = await Post.findById(req.params.postId);
      if (!oldPostData) {
        return res.status(409).json({
          message: "The post you're trying to edit doesn't exist.",
          data: updatedPostBody,
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when updating.",
        data: updatedPostBody,
      });
    }
    let unsetConfig = {};
    // Some special update values
    if (oldPostData.published && updatedPostBody.published) {
      updatedPostBody.lastEdited = Date.now();
    }
    if (!oldPostData.published && updatedPostBody.published) {
      updatedPostBody.date = Date.now();
      unsetConfig.lastEdited = 1;
    }
    if (!updatedPostBody.published) {
      unsetConfig.date = 1;
      unsetConfig.lastEdited = 1;
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "There was some errors with your submission",
        errors: errors.array(),
        data: updatedPostBody,
      });
    }

    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
        ...updatedPostBody,
        $unset: unsetConfig,
      });
      return res.status(201).json({
        message: "Successfully updated post.",
        post: updatedPost,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when updating.",
        data: updatedPostBody,
      });
    }
  },
];

exports.postDelete = async (req, res, next) => {
  try {
    await Promise.all([
      Post.findByIdAndDelete(req.params.postId),
      Comment.deleteMany({ postId: req.params.postId }),
    ]);
    return res.status(200).json({ message: "Successfully deleted post." });
  } catch (err) {
    return res.status().json({ message: "Failed to delete post." });
  }
};

exports.postCommentsGet = async (req, res, next) => {
  const isVerifiedUser = await isVerified(req);
  try {
    const [post, comments] = await Promise.all([
      Post.findById(req.params.postId),
      Comment.find({ postId: req.params.postId }),
    ]);
    // Require authentication to access unpublished posts
    if (post.published === false && !isVerifiedUser) {
      return res.status(401).json({
        message: "User does not have access to this post.",
      });
    }

    return res.status(200).json({
      message: "Successfully found comments.",
      comments: comments,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when fetching post comments.",
    });
  }
};

exports.postCommentsPost = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add a username to your comment!")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Add content to your comment!")
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const newCommentBody = {
      postId: req.params.postId,
      username: req.body.username,
      content: req.body.content,
      date: Date.now(),
    };

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "There was some errors with your submission",
        errors: errors.array(),
        data: newCommentBody,
      });
    }

    try {
      const newComment = await Comment.create(newCommentBody);
      return res.status(201).json({
        message: "Successfully created comment.",
        comment: newComment,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when submitting.",
        data: newCommentBody,
      });
    }
  },
];

exports.postCommentDelete = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({ message: "Successfully deleted comment." });
  } catch (err) {
    return res.status().json({ message: "Failed to delete comment." });
  }
};
