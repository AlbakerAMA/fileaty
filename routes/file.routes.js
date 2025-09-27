const express = require("express");
const fileController = require("../controllers/file.controller.js");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware.js");
const { upload } = require("../utils/s3.utils.js");
const router = express.Router();

// Get all files
router.get("/", verifyToken, fileController.getAllFiles);

// Get file by ID
router.get("/:id", verifyToken, fileController.getFileById);

// Upload a file
router.post("/upload", verifyToken, fileController.uploadFile);

// Download a file
router.get("/:id/download", verifyToken, fileController.downloadFile);

// Delete a file (admin only or owner)
router.delete("/:id", verifyToken, fileController.deleteFile);

module.exports = router;