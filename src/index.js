require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const cheerio = require("cheerio");
const configureAuth = require("./auth");
const errorHandler = require("./middleware/errorHandler");
const {
  validateJobApplication,
  validateRegistration,
} = require("./middleware/validation");
const bcrypt = require("bcrypt");
const passport = require("passport");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
  "https://ryan-job-trackers.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400,
  })
);



// Configure authentication
const { isAuthenticated } = configureAuth(app);

// Get all job applications
app.get("/api/jobs", isAuthenticated, async (req, res, next) => {
  try {
    const { status, sortBy } = req.query;
    let where = {
      userId: req.user.id, // Only get jobs for the current user
    };
    let orderBy = {};

    if (status) {
      where.status = status;
    }

    if (sortBy === "date") {
      orderBy = { appliedDate: "desc" };
    }

    const jobs = await prisma.jobApplication.findMany({
      where,
      orderBy,
    });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// Get a single job application
app.get("/api/jobs/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await prisma.jobApplication.findUnique({
      where: { id: parseInt(id) },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
});

// Create new job application
app.post(
  "/api/jobs",
  isAuthenticated,
  validateJobApplication,
  async (req, res, next) => {
    try {
      const jobData = {
        ...req.body,
        userId: req.user.id, // Add the user ID to the job data
      };

      const job = await prisma.jobApplication.create({
        data: jobData,
      });
      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Update job application
app.put(
  "/api/jobs/:id",
  isAuthenticated,
  validateJobApplication,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // First check if the job exists and belongs to the user
      const existingJob = await prisma.jobApplication.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingJob) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (existingJob.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this job" });
      }

      const jobData = {
        ...req.body,
        userId: req.user.id, // Ensure userId is set
      };

      const job = await prisma.jobApplication.update({
        where: { id: parseInt(id) },
        data: jobData,
      });
      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Delete job application
app.delete("/api/jobs/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    // First check if the job exists and belongs to the user
    const existingJob = await prisma.jobApplication.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (existingJob.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this job" });
    }

    await prisma.jobApplication.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Job application deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Register new user
app.post("/api/auth/register", validateRegistration, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    console.log("Registration attempt:", { email, name }); // Don't log password

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    console.log("User created successfully:", {
      id: user.id,
      email: user.email,
    });

    // Log in the user
    req.login(user, (err) => {
      if (err) {
        console.error("Login after registration failed:", err);
        return next(err);
      }
      res.json({
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
});

// Login
app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
  console.log("Login successful, user:", req.user);
  console.log("Session:", req.session);
  console.log("Session ID:", req.sessionID);
  res.json({
    message: "Login successful",
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

// Logout route
app.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Error during logout" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: "Error destroying session" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
});

// Check authentication status
app.get("/api/auth/status", (req, res, next) => {
  try {
    console.log("Checking auth status");
    console.log("Session:", req.session);
    console.log("Session ID:", req.sessionID);
    console.log("Cookies:", req.headers.cookie);
    console.log("User:", req.user);
    console.log("Is authenticated:", req.isAuthenticated());

    const isAuthenticated = req.isAuthenticated();
    const user = isAuthenticated
      ? {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
        }
      : null;

    res.json({
      authenticated: isAuthenticated,
      user,
    });
  } catch (error) {
    console.error("Auth status error:", error);
    next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
