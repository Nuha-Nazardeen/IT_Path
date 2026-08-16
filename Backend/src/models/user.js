const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    uniEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    academic: {
      university: { type: String, trim: true },
      degree: { type: String, trim: true },
      studentId: { type: String, trim: true },
      academicYear: { type: String, trim: true },
      semester: { type: String, trim: true },
      graduationYear: { type: String, trim: true },
      specialization: { type: String, trim: true },
    },
    career: {
      type: String,
      trim: true,
    },
    skills: {
      type: Map,
      of: String, // e.g., { "Python": "INT", "React": "BEG" }
    },
    planning: {
      weekdayHours: { type: String, trim: true },
      weekendHours: { type: String, trim: true },
      challenges: [{ type: String, trim: true }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
