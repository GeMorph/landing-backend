const { default: mongoose } = require("mongoose");
const { logger } = require("../utils/logger");
const { getConfig } = require("../config/config");

const dbConnect = async () => {
  try {
    const config = getConfig();
    await mongoose.connect(config.DB_CONN_STRING, {
      dbName: config.ENVIRONMENT,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to the Database Successfully");
  } catch (error) {
    logger.error("Couldn't connect to the database", { error: error.message });
  }
};

module.exports = dbConnect;
