const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { logger } = require("./utils/logger");
const morgan = require("morgan");
const serverless = require("serverless-http");
const dbConnect = require("./config/dbConnect");
const { loadConfig } = require("./config/config");
const caseRoute = require('./routes/caseRoute');

// Load environment variables early
dotenv.config();

// Initialize the app
const app = express();

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
morgan.token("host", (req) => req.headers.host || "");
app.use(morgan(":method :host :status :res[content-length] - :response-time ms"));
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

let isInitialized = false;

// Initialization function
const initialize = async () => {
  try {
    if (!isInitialized) {
      logger.info("Initializing server...");
      await loadConfig();
      await dbConnect();
      logger.info("Server initialized successfully.");
      isInitialized = true;
    }
  } catch (error) {
    logger.error(`Error during server initialization: ${error.message}`);
    console.error("Error during server initialization:", error);
    process.exit(1); // Terminate if initialization fails
  }
};

// Load application routes
app.use("/api/case", caseRoute);

// Modify the handler
const handler = async (event, context) => {
  if (!isInitialized) await initialize(); // Ensure initialization happens only once
  const serverlessHandler = serverless(app); // Generate the serverless handler
  return serverlessHandler(event, context);
};

module.exports = { handler };
