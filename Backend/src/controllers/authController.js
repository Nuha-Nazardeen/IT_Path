const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Register user
exports.register = async (req, res) => {
  try {
    const { fullName, uniEmail, password, academic, career, skills, planning } = req.body;

    if (!fullName || !uniEmail || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ uniEmail: uniEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this university email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set default role (first user as admin, or normal student logic)
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? "admin" : "student";

    const newUser = new User({
      fullName,
      uniEmail: uniEmail.toLowerCase(),
      password: hashedPassword,
      role,
      academic,
      career,
      skills,
      planning,
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check database
    let user = await User.findOne({ uniEmail: normalizedEmail });

    // Handle standard/first admin initial log in
    if (!user && normalizedEmail === "admin@gmail.com" && password === "admin123") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      user = new User({
        fullName: "Administrator",
        uniEmail: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      await user.save();
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid university email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid university email or password." });
    }

    // Initialize session
    req.session.user = {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
    };

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// Get current session user
exports.getMe = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(200).json({ authenticated: false });
    }

    res.status(200).json({
      authenticated: true,
      user: {
        id: req.session.user.id,
        fullName: req.session.user.fullName,
        role: req.session.user.role,
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error checking session." });
  }
};

// Logout user
exports.logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: "Logout successful" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ message: "Could not log out, please try again." });
    }
    res.clearCookie("connect.sid"); // standard name for express-session cookie
    res.status(200).json({ message: "Logout successful" });
  });
};
