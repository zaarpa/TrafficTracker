const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.post("/createComment/:id", commentController.createComment); //postID dibo
router.patch("/editComment/:id", commentController.editComment); //commentID dibo
router.delete("/deleteComment/:id", commentController.deleteComment); //commentID dibo
module.exports = router;
