import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    name: { type: String, required: true, trim: true },
    year: { type: String, trim: true, alias: "academicYear" },
    semesterNumber: { type: Number, min: 1, max: 8 },
    startDate: { type: Date },
    endDate: {
      type: Date,
      validate: {
        validator(value) {
          return !value || !this.startDate || value >= this.startDate;
        },
        message: "endDate must be on or after startDate.",
      },
    },
    semesterGpa: { type: Number, min: 0, max: 4.2 },
    cumulativeGpa: { type: Number, min: 0, max: 4.2 },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Ongoing",
    },
  },
  { timestamps: true }
);

semesterSchema.index({ owner: 1, year: 1, semesterNumber: 1 });
semesterSchema.index({ owner: 1, status: 1 });

export default mongoose.model("Semester", semesterSchema);
