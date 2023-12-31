const { Router } = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controllers");
const router = Router();
router.get("/signup", authController.getSignUp);
router.post("/signup", authController.postSignUp);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.getLogout);
router.get(
  "/google",
  passport.authenticate("google"),
  authController.loginWithGoogle
);
router.get("/loginGoogle", passport.authenticate("google"));
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.passwordReset);

module.exports = router;
