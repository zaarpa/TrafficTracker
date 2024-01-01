const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
