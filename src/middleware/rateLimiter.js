const rateLimit = require("express-rate-limit");

const linkedInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    details: "Please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  linkedInLimiter,
};
