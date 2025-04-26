require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const cheerio = require("cheerio");
const errorHandler = require("./middleware/errorHandler");
const {
  validateJobApplication,
  validateRegistration,
} = require("./middleware/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("./auth");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
//  Health check route FIRST
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// CORS configuration
app.use(
  cors({
    origin: "https://ryan-job-trackers.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Handle OPTIONS requests
app.options("*", (req, res) => {
  res.sendStatus(204);
});

app.use(express.json());

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
    console.log("Registration attempt:", { email, name });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    console.log("User created successfully:", { id: user.id, email: user.email });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
});

// Login user 
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "24h" }
    );

    console.log("Login successful:", { email: user.email, id: user.id });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

// Check authentication status
app.get("/api/auth/status", isAuthenticated, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
