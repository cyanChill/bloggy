const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  username: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Comment", CommentSchema);
