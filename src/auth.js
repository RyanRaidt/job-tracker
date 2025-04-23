const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const session = require("express-session");

const configureAuth = (app) => {
  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // LinkedIn Strategy configuration
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL,
        scope: ["r_liteprofile", "r_emailaddress"],
      },
      function (accessToken, refreshToken, profile, done) {
        // Store the access token in the session
        profile.accessToken = accessToken;
        return done(null, profile);
      }
    )
  );

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from the session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // LinkedIn authentication routes
  app.get("/auth/linkedin", passport.authenticate("linkedin"));

  app.get(
    "/auth/linkedin/callback",
    passport.authenticate("linkedin", { failureRedirect: "/login" }),
    function (req, res) {
      res.redirect("/");
    }
  );

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
