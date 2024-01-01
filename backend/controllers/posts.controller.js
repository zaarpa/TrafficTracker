const Post = require("../models/Post.model");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");

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
const createPost = async (req, res) => {
  const { caption } = req.body;
  const token = req.cookies.jwt;
  let userId;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const post = new Post({
    caption,
    userId,
  });
  try {
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPost = async (req, res) => {
  const token = req.cookies.jwt;
  let userId;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  try {
    const posts = await Post.find({ userId: userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPostOfAllUsers = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPostOfAnotherUser = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const posts = await Post.find({ userId: userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const createLocationBasedPost = async (req, res) => {
  const { caption, location } = req.body;
  const token = req.cookies.jwt;
  let userId;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const post = new Post({
    caption,
    location,
    userId,
  });
  try {
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPostByLocation = async (req, res) => {
  const location = req.params.location;
  try {
    const posts = await Post.find({ location: location });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateLocationOfPost = async (req, res) => {
  try {
    console.log(req);
    const postId = req.params.id;
    location = req.body.location;
    const post = await Post.findOne({ _id: postId });
    if (post.userId !== getCurrentUser(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    post.location = location;
    await post.save();
    res.json(post);
    res.json({ message: "Location updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getPostByHashtag = async (req, res) => {
  const hashtag = req.params.hashtag;
  try {
    const posts = await Post.find({ hashtags: hashtag });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const createPostWithHashtags = async (req, res) => {
  const { caption, hashtags } = req.body;
  const token = req.cookies.jwt;
  let userId;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const post = new Post({
    caption,
    hashtags,
    userId,
  });
  try {
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updatePost = async (req, res) => {
  try {
    const { caption, location, hashtags } = req.body;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.userId !== getCurrentUser(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    post.caption = caption;
    post.location = location;
    post.hashtags = [...post.hashtags, ...hashtags];
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    await post.deleteOne({ _id: postId });
    res.json({ message: "Post deleted successfully" });
  } catch {
    res.status(500).json({ error: err.message });
  }
};

const postImages = async (req, res) => {
  try {
    console.log(req);
    if (!req.files) {
      return res.status(400).json({ error: "Please upload a file" });
    }
    const photos = req.files.map((file) => file.filename);
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (post.userId !== getCurrentUser(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    post.images = [...post.images, ...photos];
    await post.save();
    res.json({ message: "Images uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getImages = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    const images = post.images;
    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteImages = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (post.userId !== getCurrentUser(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const images = post.images;
    images.forEach((image) => {
      fs.unlinkSync(`uploads/${image}`);
    });
    post.images = [];
    res.json({ message: "Images deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const postVideos = async (req, res) => {
  try {
    console.log(req);
    if (!req.files) {
      return res.status(400).json({ error: "Please upload a file" });
    }
    const videos = req.files.map((file) => file.filename);
    console.log(videos);
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (post.userId !== getCurrentUser(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    post.videos = [...post.videos, ...videos];
    await post.save();
    res.json({ message: "Videos uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getVideos = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    const videos = post.videos;
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteVideos = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    if (post.userId !== getCurrentUser(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const videos = post.videos;
    videos.forEach((video) => {
      fs.unlinkSync(`uploads/${video}`);
    });
    post.videos = [];
    res.json({ message: "videos deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getPost,
  getPostOfAllUsers,
  getPostOfAnotherUser,
  createLocationBasedPost,
  getPostByLocation,
  updateLocationOfPost,
  getPostByHashtag,
  createPostWithHashtags,
  updatePost,
  deletePost,
  postImages,
  getImages,
  deleteImages,
  postVideos,
  getVideos,
  deleteVideos,
};
