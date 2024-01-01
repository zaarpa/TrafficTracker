const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const jwt = require("jsonwebtoken");

const getCurrentUser = (req) => {
  const token = req.cookies.jwt;
  let userId;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
    return userId;
  } catch (err) {
    return "error";
  }
};

const createComment = async (req, res) => {
  const commentText = req.body.comment;
  const postId = req.params.id;
  const userId = getCurrentUser(req);
  const newComment = new Comment({
    commentText,
    postId,
    userId,
  });
  try {
    await newComment.save();
    const post = await Post.findOne({ _id: postId });
    post.comments.push(newComment._id);
    await post.save();
    res.send(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const editComment = async (req, res) => {
  const updatedComment = req.body.comment;
  const commentId = req.params.id;
  const comment = await Comment.findOne({ _id: commentId });
  if (comment.userId != getCurrentUser(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  comment.commentText = updatedComment;
  try {
    await comment.save();
    res.send(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findOne({ _id: commentId });
  const post = await Post.findById(comment.postId);
  if (comment.userId != getCurrentUser(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    await post.comments.pull(commentId);
    await post.save();
    await comment.deleteOne({ _id: commentId });
    res.json({ message: "Comment deleted successfully" });
  } catch {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createComment, editComment, deleteComment };
