const errorHandler = (err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
  });

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

  // Handle Passport errors
  if (err.name === "AuthenticationError") {
    return res.status(401).json({
      error: "Authentication error",
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
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
