const validateJobApplication = (req, res, next) => {
  const { company, position } = req.body;

  if (!company || !position) {
    const error = new Error("Company and position are required");
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.name = "ValidationError";
    return next(error);
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters long");
    error.name = "ValidationError";
    return next(error);
  }

  next();
};

module.exports = {
  validateJobApplication,
  validateRegistration,
};
