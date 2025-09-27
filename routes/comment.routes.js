const express = require("express");
const commentController = require("../controllers/comment.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");
const router = express.Router();

// Get all comments for a file
router.get("/file/:fileId", verifyToken, commentController.getCommentsByFileId);

// Create a new comment
router.post("/file/:fileId", verifyToken, commentController.createComment);

// Delete a comment
router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;