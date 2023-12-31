const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/auth.routes");
const homeRoutes = require("./routes/home.routes");
const postRoutes = require("./routes/posts.routes");
const passportSetup = require("./config/passport.js");
const { requireAuth, checkUser } = require("./middleware/auth.middleware");

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("*", checkUser);

//routes
app.use(authRoutes);
app.use(requireAuth);
app.use(homeRoutes);
app.use(postRoutes);
module.exports = app;
