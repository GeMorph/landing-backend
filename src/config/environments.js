const { getSecret } = require("../utils/getSecrets");
const dotenv = require("dotenv");

dotenv.config();
const ENVIRONMENT = process.env.ENVIRONMENT || "local";
let DB_CONN_STRING = process.env.DB_CONN_STRING || "";
const PORT = process.env.PORT || 3001;
// Fetch secrets based on environment and Lambda settings
const fetchSecrets = async () => {
  if (ENVIRONMENT !== "local")
    DB_CONN_STRING =
      (await getSecret(`/${ENVIRONMENT}/mongodb/conn-string`)) ||
      DB_CONN_STRING;
};

// Initialize the secrets and then export the config
const initConfig = async () => {
  console.log("Fetching secrets...");
  await fetchSecrets();

  return {
    port: PORT,
    DB_CONN_STRING: DB_CONN_STRING,
    ENVIRONMENT: ENVIRONMENT,
  };
};

module.exports = initConfig;
