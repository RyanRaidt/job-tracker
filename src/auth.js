const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
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
      }),
      secret: process.env.SESSION_SECRET || "dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "none",
        httpOnly: true,
        path: "/",
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

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

  // Only configure LinkedIn Strategy if credentials are provided
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(
      new LinkedInStrategy(
        {
          clientID: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          callbackURL: process.env.LINKEDIN_CALLBACK_URL,
          scope: ["r_liteprofile", "r_emailaddress"],
        },
        async function (accessToken, refreshToken, profile, done) {
          try {
            // Check if user exists
            let user = await prisma.user.findUnique({
              where: { email: profile.emails[0].value },
            });

            // If user doesn't exist, create one
            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: profile.emails[0].value,
                  name: profile.displayName,
                  password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for LinkedIn users
                },
              });
            }

            // Store the access token
            user.accessToken = accessToken;
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );

    // LinkedIn authentication routes
    app.get("/auth/linkedin", passport.authenticate("linkedin"));

    app.get(
      "/auth/linkedin/callback",
      passport.authenticate("linkedin", { failureRedirect: "/login" }),
      function (req, res) {
        res.redirect("/");
      }
    );
  }

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
