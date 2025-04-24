const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Access-Control-Allow-Private-Network"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Routes
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

app.post("/api/jobs", async (req, res, next) => {
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

app.put("/api/jobs/:id", async (req, res, next) => {
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

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
