import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    uniEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
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
    career: { type: String, trim: true },
    skills: { type: Map, of: String },
    planning: {
      weekdayHours: { type: String, trim: true },
      weekendHours: { type: String, trim: true },
      challenges: [{ type: String, trim: true }],
    },
    profile: {
      profilePhotoUrl: { type: String, trim: true },
      professionalHeadline: { type: String, trim: true },
      about: { type: String, trim: true },
      links: [
        { label: { type: String, trim: true }, url: { type: String, trim: true } },
      ],
      notificationPreferences: {
        emailReminders: { type: Boolean, default: true },
        deadlineAlerts: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
