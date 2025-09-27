const db = require("../models");
const File = db.File;
const User = db.User;
const Comment = db.Comment;
const { upload, deleteFileFromS3 } = require("../utils/s3.utils.js");
const multer = require('multer');

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      include: [{
        model: User,
        as: "uploader",
        attributes: ["id", "username"]
      }]
    });
    
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id, {
      include: [{
        model: User,
        as: "uploader",
        attributes: ["id", "username"]
      }]
    });
    
    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }
    
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload a file to S3 and save metadata to database
exports.uploadFile = (req, res) => {
  // Use multer upload middleware
  upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return res.status(500).json({ message: "Unknown error: " + err.message });
    }
    
    try {
      // Save file metadata to database
      const file = await File.create({
        filename: req.file.key,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.contentType,
        url: req.file.location,
        uploaderId: req.userId
      });
      
      res.status(201).json({
        message: "File uploaded successfully!",
        file: file
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Delete a file from S3 and database
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }
    
    // Check if user is admin or owner
    if (req.userRole !== "admin" && req.userId !== file.uploaderId) {
      return res.status(403).json({ message: "Access denied!" });
    }
    
    // Delete file from S3
    await deleteFileFromS3(file.filename);
    
    // Delete file from database
    await file.destroy();
    
    res.status(200).json({ message: "File deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download a file (redirect to S3 URL)
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }
    
    // Redirect to S3 URL for download
    res.redirect(file.url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};