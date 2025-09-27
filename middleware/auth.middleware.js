const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

// Verify token
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required!" });
  }
  next();
};

// Check if user is admin or owner of the resource
exports.isAdminOrOwner = async (req, res, next) => {
  try {
    if (req.userRole === "admin") {
      return next();
    }
    
    // For file operations, check if user is the uploader
    if (req.params.fileId) {
      const file = await db.File.findByPk(req.params.fileId);
      if (file && file.uploaderId === req.userId) {
        return next();
      }
    }
    
    // For comment operations, check if user is the comment owner
    if (req.params.commentId) {
      const comment = await db.Comment.findByPk(req.params.commentId);
      if (comment && comment.userId === req.userId) {
        return next();
      }
    }
    
    return res.status(403).json({ message: "Access denied!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};