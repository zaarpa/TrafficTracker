const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts.controller");
const requireImage = require("../middleware/image.middleware");

router.post("/createPost", postController.createPost);
router.get("/getPost", postController.getPost);
router.get("/getAllUsersPosts", postController.getPostOfAllUsers);
router.get("/getUserPostById/:id", postController.getPostOfAnotherUser);
router.post("/createPostWithLocation", postController.createLocationBasedPost);
router.get("/getPostWithLocation/:location", postController.getPostByLocation);
router.post("/createPostWithHashtags", postController.createPostWithHashtags);
router.get("/getPostByHashtag/:hashtag", postController.getPostByHashtag);
router.patch("/updatePostCaption/:id", postController.updatePost);
router.delete("/deletePost/:id", postController.deletePost);
router.patch(
  "/uploadImages/:id",
  requireImage.uploadImage.array("images", 10),
  postController.postImages
);
module.exports = router;
