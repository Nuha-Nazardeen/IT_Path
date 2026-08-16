const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const configureSession = require("./config/session");

// Load Environment variables
dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// CORS configuration with credentials support
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing Middleware
app.use(express.json());

// Session Middleware
app.use(configureSession());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ITPath Backend API is running",
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});