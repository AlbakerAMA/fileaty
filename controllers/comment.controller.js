const db = require("../models");
const Comment = db.Comment;
const File = db.File;

// Get all comments for a file
exports.getCommentsByFileId = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        fileId: req.params.fileId
      },
      include: [{
        model: db.User,
        as: "user",
        attributes: ["id", "username"]
      }]
    });
    
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    // Check if file exists
    const file = await File.findByPk(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }
    
    const comment = await Comment.create({
      content: req.body.content,
      fileId: req.params.fileId,
      userId: req.userId // Assuming we get this from auth middleware
    });
    
    // Include user info in response
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: db.User,
        as: "user",
        attributes: ["id", "username"]
      }]
    });
    
    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found!" });
    }
    
    // Check if user is admin or owner of the comment
    if (req.userRole !== "admin" && req.userId !== comment.userId) {
      return res.status(403).json({ message: "Access denied!" });
    }
    
    await comment.destroy();
    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};