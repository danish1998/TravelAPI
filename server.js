// Load environment variables FIRST
// Only load .env file in development, Railway provides env vars directly
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

// Debug environment variables
console.log('=== Environment Variables Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('AMADEUS_CLIENT_ID:', process.env.AMADEUS_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('AMADEUS_CLIENT_SECRET:', process.env.AMADEUS_CLIENT_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('VIATOR_API_KEY:', process.env.VIATOR_API_KEY ? 'SET' : 'NOT SET');
console.log('================================');

const express = require("express");
const { requestLogger, addTimeStamp } = require("./middleware/customMiddleware");
const { configureCors } = require("./config/corsConfig");
const { createBasicRateLimiter } = require("./middleware/rateLimiting");
const { urlVersioning } = require("./middleware/apiVersioning");
const { globalErrorhandler } = require("./middleware/ErrorHandler");
const { connectDB } = require("./helpers/ConnectDB");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./middleware/passport");
const { verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 8080;

// express json middleware
app.use(requestLogger);
app.use(addTimeStamp);
app.use(configureCors());
app.use(
  createBasicRateLimiter(
    process.env.RATE_LIMIT_MAX_REQUESTS || 1000,
    process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 10000
  )
); // Rate limiting: 100 requests per 15 minutes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration for Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRouter = require("./routes/auth-routes");
const testRouter = require("./routes/test-routes");
const flightsRouter = require("./routes/flights-routes");
const hotelsRouter = require("./routes/hotels-routes");
const locationRouter = require("./routes/location-routes");
const cityRouter = require("./routes/cities-routes");
const toursRouter = require("./routes/tours-routes");
const viatorRouter = require("./routes/viator-routes");
const airportsRouter = require("./routes/airports-routes");
const aiPlanningRouter = require("./routes/ai-planning-routes");
const favoritesRouter = require("./routes/favorites-routes");

// Apply API versioning to all /api routes
app.use("/api", urlVersioning("v1"));

// Auth routes (no versioning needed for OAuth)
app.use("/api/v1/auth", authRouter);

// Test routes
app.use("/api/v1/test", testRouter);

// Other API routes
app.use("/api/v1/flights", flightsRouter);
app.use("/api/v1/hotels", hotelsRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/viator", viatorRouter);
app.use("/api/v1/airports", airportsRouter);
app.use("/api/v1/ai-planning", aiPlanningRouter);
app.use("/api/v1/favorites", favoritesRouter);
app.get("/api/v1", (req, res) => {
  res.json({ message: "Travel API v1 is running!" });
});

// Example protected route to validate JWT from cookies
app.get("/api/v1/protected", verifyToken(), (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
});

// Global error handler (must be last)
app.use(globalErrorhandler);

// ✅ Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
  });
});
