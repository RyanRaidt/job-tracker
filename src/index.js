require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const cheerio = require("cheerio");
const configureAuth = require("./auth");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configure authentication
const { isAuthenticated } = configureAuth(app);

// Get all job applications
app.get("/api/jobs", async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// Create new job application
app.post("/api/jobs", async (req, res) => {
  try {
    const jobData = req.body;
    const job = await prisma.jobApplication.create({
      data: jobData,
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job application
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = req.body;
    const job = await prisma.jobApplication.update({
      where: { id: parseInt(id) },
      data: jobData,
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job application
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.jobApplication.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Job application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scrape LinkedIn job data
app.post("/api/scrape-linkedin", isAuthenticated, async (req, res) => {
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
    console.error("LinkedIn scraping error:", error);
    res.status(500).json({
      error: "Failed to scrape LinkedIn job data",
      details: error.message,
    });
  }
});

// Check authentication status
app.get("/api/auth/status", (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
