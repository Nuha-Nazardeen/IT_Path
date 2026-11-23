export const requireRole = (role) => (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.session.user.role !== role) {
    return res.status(403).json({ message: "You do not have permission to access this resource." });
  }

  next();
};
