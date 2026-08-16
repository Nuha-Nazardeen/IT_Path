const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & start session
// @access  Public
router.post("/login", authController.login);

// @route   GET /api/auth/me
// @desc    Get session user details
// @access  Public (returns { authenticated: false } if no session, does not throw 401)
router.get("/me", authController.getMe);

// @route   POST /api/auth/logout
// @desc    Destroy session and logout user
// @access  Public
router.post("/logout", authController.logout);

module.exports = router;
