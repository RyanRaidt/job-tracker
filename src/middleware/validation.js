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

module.exports = {
  validateJobApplication,
  validateLinkedInUrl,
};
