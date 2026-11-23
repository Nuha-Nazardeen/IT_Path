import session from "express-session";
import MongoStore from "connect-mongo";

export const configureSession = () => {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing. Add it to Backend/.env.");
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "sessions",
      ttl: 30 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    },
  });
};
