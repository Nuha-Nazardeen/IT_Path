import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import { configureSession } from "./config/session.js";
import authRoutes from "./routes/authRoutes.js";
import studentDataRoutes from "./routes/studentDataRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL || "http://localhost:5173",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(configureSession());

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    server: "running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentDataRoutes);
app.use("/api/files", fileRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "A duplicate record already exists." });
  }
  return res.status(error.status || 500).json({
    message: error.message || "Internal server error.",
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    const PORT = Number(process.env.PORT) || 5000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
};

startServer();