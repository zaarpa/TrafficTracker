const User = require("../models/User.model");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google",
      scope: ["profile", "email"],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      console.log(profile.emails[0].value);
      console.log(profile.photos[0].value);
      const user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        return done(null, user);
      }
      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        profile_image: profile.photos[0].value,
      });
      done(null, newUser);
    },
    passport.serializeUser((user, done) => {
      done(null, user._id);
    }),
    passport.deserializeUser((id, done) => {
      User.findById(id)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err);
        });
    })
  )
);
