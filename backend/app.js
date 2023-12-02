const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/posts.routes");
const { requireAuth, checkUser } = require("./middleware/auth.middleware");

app.use(express.json());
// app.use("/api/posts", postRoutes);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("*", checkUser);
app.get("/", requireAuth, (req, res) => res.render("home"));
//routes
app.use(authRoutes);
module.exports = app;
