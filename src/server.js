const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { logger } = require("./utils/logger");
const morgan = require("morgan");
const serverless = require("serverless-http");
const dbConnect = require("./config/dbConnect");
const { loadConfig } = require("./config/config");
const { initializeFirebase } = require("./config/firebase");
const caseRoute = require("./routes/caseRoute");
const userRoute = require("./routes/userRoute");

// Load environment variables early
dotenv.config();

// Initialize the app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://gemorph-frontend-s3-bucket.s3-website-us-east-1.amazonaws.com",
    "https://gemorph-frontend-s3-bucket.s3-website-us-east-1.amazonaws.com",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Firebase-Token", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
morgan.token("host", (req) => req.headers.host || "");
app.use(
  morgan(":method :host :status :res[content-length] - :response-time ms"),
);

// Apply CORS before other middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Log CORS request details
  logger.info(`CORS request from origin: ${origin}`);

  if (corsOptions.origin.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      corsOptions.methods.join(","),
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      corsOptions.allowedHeaders.join(","),
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", corsOptions.maxAge);
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    logger.info("Handling OPTIONS preflight request");
    return res.status(200).end();
  }
  next();
});

// Apply other security middleware after CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  }),
);

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

let isInitialized = false;

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
    console.error("Error during server initialization:", error);
    throw error;
  }
};

// Load application routes
app.use("/api/case", caseRoute);
app.use("/api/user", userRoute);

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

// Modify the handler
const handler = async (event, context) => {
  try {
    if (!isInitialized) await initialize();

    // Log the incoming event for debugging
    logger.info("Incoming Lambda event:", JSON.stringify(event, null, 2));

    const serverlessHandler = serverless(app, {
      request: {
        headers: event.headers || {},
      },
    });

    const result = await serverlessHandler(event, context);

    // Ensure CORS headers are present in the response
    if (!result.headers) {
      result.headers = {};
    }

    // Add CORS headers to the response
    const origin = event.headers?.origin;
    if (origin && corsOptions.origin.includes(origin)) {
      result.headers["Access-Control-Allow-Origin"] = origin;
      result.headers["Access-Control-Allow-Methods"] =
        corsOptions.methods.join(",");
      result.headers["Access-Control-Allow-Headers"] =
        corsOptions.allowedHeaders.join(",");
      result.headers["Access-Control-Allow-Credentials"] = "true";
      result.headers["Access-Control-Max-Age"] = corsOptions.maxAge;
    }

    // Log the response for debugging
    logger.info("Lambda response:", JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    logger.error("Lambda handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};

module.exports = { handler };
