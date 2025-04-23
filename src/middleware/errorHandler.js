const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Prisma errors
  if (err.code?.startsWith("P")) {
    return res.status(400).json({
      error: "Database error",
      details: err.message,
    });
  }

  // Handle LinkedIn API errors
  if (err.response?.status === 401) {
    return res.status(401).json({
      error: "LinkedIn authentication failed",
      details: "Please re-authenticate with LinkedIn",
    });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      details: "Too many requests to LinkedIn API",
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation error",
      details: err.message,
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal server error",
    details:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

module.exports = errorHandler;
