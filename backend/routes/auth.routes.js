const { Router } = require("express");
const authController = require("../controllers/auth.controllers");
const router = Router();
router.get("/signup", authController.getSignUp);
router.post("/signup", authController.postSignUp);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.getLogout);

module.exports = router;
