import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to Backend/.env.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;