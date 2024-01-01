const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { name: "", email: "", password: "" };
  if (err.message === "Incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "Incorrect password") {
    errors.password = "That password is incorrect";
  }
  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};
const getSignUp = (req, res) => {
  res.render("signup");
};
const getLogin = (req, res) => {
  res.render("login");
};
const postSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    console.log(err);
    res.status(400).json({ errors });
  }
};
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const getLogout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("connect.sid", "", { maxAge: 1 });
  res.redirect("/login");
};

const loginWithGoogle = async (req, res) => {
  try {
    const token = createToken(req.user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors });
  }
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Error("User not found"));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}`;
  console.log(message);
};

const passwordReset = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new Error("Invalid token or token expired"));
  }
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(req.body.password, salt);
  console.log("ekhane ashe");
  user.passwordResetToken = undefined;
  console.log("undefined hoyna");
  user.passwordResetTokenExpires = undefined;
  await user.save();
  res.redirect("/login");
};
module.exports = {
  getSignUp,
  getLogin,
  postSignUp,
  postLogin,
  getLogout,
  loginWithGoogle,
  forgotPassword,
  passwordReset,
};
