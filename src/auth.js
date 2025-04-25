const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const configureAuth = (app) => {
  // Create a new pool using the same connection string
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Session configuration
  app.use(
    session({
      store: new pgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
        pruneSessionInterval: 60, // Prune expired sessions every 60 seconds
      }),
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "lax",
        httpOnly: true,
        path: "/",
      },
      name: "connect.sid",
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Add session debugging middleware
  app.use((req, res, next) => {
    console.log("Session Debug:", {
      sessionID: req.sessionID,
      session: req.session,
      cookies: req.cookies,
      isAuthenticated: req.isAuthenticated(),
    });
    next();
  });

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

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Authentication required" });
  };

  return { isAuthenticated };
};

module.exports = configureAuth;
