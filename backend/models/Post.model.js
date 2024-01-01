const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  hashtags: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  videos: {
    type: [String],
    default: [],
  },
  userId: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
