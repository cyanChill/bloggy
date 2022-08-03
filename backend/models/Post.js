const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, default: false, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  date: { type: Date },
  lastEdited: { type: Date },
});

module.exports = mongoose.model("Post", PostSchema);
