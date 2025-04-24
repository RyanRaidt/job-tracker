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
  validateLinkedInUrl,
} = require("./middleware/validation");
const { linkedInLimiter } = require("./middleware/rateLimiter");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configure authentication
const { isAuthenticated } = configureAuth(app);

// Get all job applications
app.get("/api/jobs", async (req, res, next) => {
  try {
    const { status, sortBy } = req.query;
    let where = {};
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
app.get("/api/jobs/:id", async (req, res, next) => {
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
app.post("/api/jobs", validateJobApplication, async (req, res, next) => {
  try {
    const jobData = req.body;
    const job = await prisma.jobApplication.create({
      data: jobData,
    });
    res.json(job);
  } catch (error) {
    next(error);
  }
});

// Update job application
app.put("/api/jobs/:id", validateJobApplication, async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobData = req.body;
    const job = await prisma.jobApplication.update({
      where: { id: parseInt(id) },
      data: jobData,
    });
    res.json(job);
  } catch (error) {
    next(error);
  }
});

// Delete job application
app.delete("/api/jobs/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.jobApplication.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Job application deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Scrape LinkedIn job data
app.post(
  "/api/scrape-linkedin",
  isAuthenticated,
  linkedInLimiter,
  validateLinkedInUrl,
  async (req, res, next) => {
    try {
      const { url } = req.body;
      const accessToken = req.user.accessToken;

      // First, get the job ID from the URL
      const jobId = url.split("/").pop();

      // Use LinkedIn API to get job details
      const response = await axios.get(
        `https://api.linkedin.com/v2/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      const jobData = {
        company: response.data.company.name,
        position: response.data.title,
        location: response.data.location,
        url: url,
        notes: `Scraped from LinkedIn - ${response.data.description.substring(
          0,
          200
        )}...`,
      };

      res.json(jobData);
    } catch (error) {
      next(error);
    }
  }
);

// Check authentication status
app.get("/api/auth/status", (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
