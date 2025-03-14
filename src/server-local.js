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

dotenv.config();

const initialize = async () => {
  await loadConfig();
  await dbConnect();
};

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/case", caseRoute);
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

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

initialize();
