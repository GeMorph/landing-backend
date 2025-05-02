const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const caseRoute = require("./routes/caseRoute");
const { logger } = require("./utils/logger");
const { loadConfig } = require("./config/config");
const { initializeFirebase } = require("./config/firebase");
const userRoute = require("./routes/userRoute");

dotenv.config();

const initialize = async () => {
  try {
    await loadConfig();
    await dbConnect();
    await initializeFirebase();
    logger.info("Server initialized successfully");
  } catch (error) {
    logger.error(`Error during server initialization: ${error.message}`);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/case", caseRoute);
app.use("/api/user", userRoute);
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

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

initialize();
