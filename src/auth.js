const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: "Authentication required",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Authentication failed",
      message: "Invalid or expired token",
    });
  }
};

module.exports = { isAuthenticated };
