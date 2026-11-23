import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const register = async (req, res, next) => {
  try {
    const { fullName, uniEmail, password, academic, career, skills, planning } = req.body;

    if (!fullName?.trim() || !uniEmail?.trim() || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    if (!/^\S+@\S+\.\S+$/.test(uniEmail.trim())) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const normalizedEmail = uniEmail.trim().toLowerCase();
    const existingUser = await User.findOne({ uniEmail: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this university email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName: fullName.trim(),
      uniEmail: normalizedEmail,
      password: hashedPassword,
      role: "student",
      academic,
      career,
      skills,
      planning,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ uniEmail: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid university email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid university email or password." });
    }

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
    next(error);
  }
};

export const getMe = async (req, res) => {
  if (!req.session?.user) {
    return res.status(200).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    user: req.session.user,
  });
};

export const logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: "Logout successful" });
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Could not log out, please try again." });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
};
