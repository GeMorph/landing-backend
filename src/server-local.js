const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const caseRoute = require("./routes/caseRoute");
const { logger } = require("./utils/logger");
const { loadConfig } = require("./config/config");
const { initializeFirebase } = require("./config/firebase");
const userRoute = require("./routes/userRoute");
const reportRoute = require("./routes/reportRoute");

// Load environment variables early
dotenv.config();

let isInitialized = false;

// Initialize the app
const app = express();

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Keep CORS for local development
app.use(cookieParser());
morgan.token("host", (req) => req.headers.host || "");
app.use(
  morgan(":method :host :status :res[content-length] - :response-time ms"),
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "same-origin" }));

// Health check endpoint
app.get("/api/", async (req, res) => {
  try {
    logger.info("HEALTH -> GET_HEALTH = Health OK! Server is running");
    return res.status(200).send({
      status: 200,
      success: true,
      message: "Health OK! Server is running",
    });
  } catch (err) {
    logger.error(`HEALTH -> GET_HEALTH = ${err.message}`);
    return res.status(500).send({
      status: 500,
      success: false,
      error: { code: 500, message: err.message },
    });
  }
});

// Initialization function
const initialize = async () => {
  try {
    if (!isInitialized) {
      logger.info("Initializing server...");
      await loadConfig();
      await dbConnect();
      await initializeFirebase();
      logger.info("Server initialized successfully.");
      isInitialized = true;
    }
  } catch (error) {
    logger.error(`Error during server initialization: ${error.message}`);
    process.exit(1);
  }
};

// Load application routes
app.use("/api/case", caseRoute);
app.use("/api/user", userRoute);
app.use("/api/reports", reportRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    status: 500,
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
  next(err);
});

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  initialize(); // Initialize after server starts
});
