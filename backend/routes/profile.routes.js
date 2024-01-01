const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const requireImage = require("../middleware/image.middleware");

router.get("/profile", profileController.getProfileInfo);
router.get("/profiles/:id", profileController.getProfileInfos);
router.patch("/updateProfile", profileController.updateProfileInfo);
router.patch(
  "/updateProfilePicture",
  requireImage.uploadImage.single("profile_image"),
  profileController.updateProfileImage
);
router.patch("/updatePassword", profileController.updatePassword);
router.delete("/deleteProfile", profileController.deleteProfile);

module.exports = router;
