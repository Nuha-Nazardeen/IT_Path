import express from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Authenticate user & start session
// @access  Public
router.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get session user details
// @access  Public (returns { authenticated: false } if no session, does not throw 401)
router.get("/me", getMe);

// @route   POST /api/auth/logout
// @desc    Destroy session and logout user
// @access  Public
router.post("/logout", logout);

export default router;
