// Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const { requestLogger, addTimeStamp } = require("./middleware/customMiddleware");
const { configureCors } = require("./config/corsConfig");
const { createBasicRateLimiter } = require("./middleware/rateLimiting");
const { urlVersioning } = require("./middleware/apiVersioning");
const { globalErrorhandler } = require("./middleware/ErrorHandler");
const { connectDB } = require("./helpers/ConnectDB"); // <-- import connectDB
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./middleware/auth");
const itemsRouter = require("./routes/item-routes");

const app = express();
const PORT = process.env.PORT || 8080;

// express json middleware
app.use(requestLogger);
app.use(addTimeStamp);
app.use(configureCors());
app.use(
  createBasicRateLimiter(
    process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000
  )
); // Rate limiting: 100 requests per 15 minutes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply API versioning to all /api routes
app.use("/api", urlVersioning("v1"));

// Routes
const authRouter = require("./routes/auth-routes");
const flightsRouter = require("./routes/flights-routes");
const hotelsRouter = require("./routes/hotels-routes");
const locationRouter = require("./routes/location-routes");
const weekendGetawaysRouter = require("./routes/weekend-getaways-routes");
const travelCategoriesRouter = require("./routes/travel-categories-routes");
const continentsRouter = require("./routes/continents-routes");
// app.use("/api/v1/auth", authRouter);
app.use("/api/v1/flights", flightsRouter);
app.use("/api/v1/hotels", hotelsRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/weekend-getaways", weekendGetawaysRouter);
app.use("/api/v1/travel-categories", travelCategoriesRouter);
app.use("/api/v1/continents", continentsRouter);
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
