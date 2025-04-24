const validateJobApplication = (req, res, next) => {
  const { company, position, status } = req.body;

  const errors = [];

  if (!company) {
    errors.push("Company name is required");
  }

  if (!position) {
    errors.push("Position is required");
  }

  if (status && !["applied", "interview", "rejected"].includes(status)) {
    errors.push("Status must be one of: applied, interview, rejected");
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(", "));
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

const validateLinkedInUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    const error = new Error("LinkedIn URL is required");
    error.name = "ValidationError";
    return next(error);
  }

  if (!url.includes("linkedin.com/jobs/view/")) {
    const error = new Error("Invalid LinkedIn job URL");
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

const validateRegistration = (req, res, next) => {
  console.log("Validating registration data:", req.body);
  const { email, password, name } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!name) {
    errors.push("Name is required");
  }

  if (errors.length > 0) {
    console.log("Validation errors:", errors);
    const error = new Error(errors.join(", "));
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

module.exports = {
  validateJobApplication,
  validateLinkedInUrl,
  validateRegistration,
};
