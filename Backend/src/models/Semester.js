import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  year: { type: String, trim: true },
  startDate: Date,
  endDate: Date,
  semesterGpa: Number,
  cumulativeGpa: Number,
  status: { type: String, enum: ["Upcoming", "Ongoing", "Completed"], default: "Ongoing" },
}, { timestamps: true });

export default mongoose.model("Semester", semesterSchema);
