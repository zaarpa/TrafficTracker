const User = require("../models/User.model");
const Post = require("../models/Post.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getProfileInfo = async (req, res) => {
  const token = req.cookies.jwt;
  let userId;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    userId = decodedToken.id;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  try {
    const user = await User.findOne({ _id: userId }).select("-password");
    console.log(user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getProfileInfos = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateProfileInfo = async (req, res) => {
  try {
    const name = req.body.name;
    const token = req.cookies.jwt;
    let userId;
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      userId = decodedToken.id;
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const user = await User.findOne({ _id: userId });
    if (name) {
      user.name = name;
    }
    await user.save();
    res.json({ message: "Name updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }
    const photo = req.file.filename;
    const token = req.cookies.jwt;
    let userId;
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      userId = decodedToken.id;
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const user = await User.findOne({ _id: userId });
    if (photo) {
      user.profile_image = photo;
    }
    await user.save();
    res.json({ message: "Profile image updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.cookies.jwt;
    let userId;
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      userId = decodedToken.id;
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const user = await User.findOne({ _id: userId });
    const isMatch = bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt();
    hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    let userId;
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      userId = decodedToken.id;
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    await Post.deleteMany({ userId: userId });
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("connect.sid", "", { maxAge: 1 });
    await User.deleteOne({ _id: userId });
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getProfileInfo,
  getProfileInfos,
  updateProfileInfo,
  updateProfileImage,
  updatePassword,
  deleteProfile,
};
