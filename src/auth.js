const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const configureAuth = (app) => {
  // Local Strategy for email/password
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Middleware to check if user is authenticated
  const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: "Authentication required",
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Invalid token format",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid or expired token",
      });
    }
  };

  // Add error handling middleware for authentication failures
  app.use((err, req, res, next) => {
    if (err.name === "AuthenticationError") {
      return res.status(401).json({
        error: "Authentication failed",
        message: err.message || "Invalid credentials",
      });
    }
    next(err);
  });

  return { isAuthenticated };
};

module.exports = configureAuth;
