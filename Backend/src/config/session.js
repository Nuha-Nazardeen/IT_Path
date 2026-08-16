const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const configureSession = () => {
  return session({
    secret: process.env.SESSION_SECRET || "itpath_fallback_secret_key_123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 30 * 60, // 30 minutes in seconds
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
    },
  });
};

module.exports = configureSession;
