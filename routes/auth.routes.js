const express = require("express");
const authController = require("../controllers/auth.controller.js");
const router = express.Router();

// Register a new user
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

module.exports = router;