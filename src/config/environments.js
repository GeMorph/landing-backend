const getSecret = require("../utils/getSecrets");

// For local development, ensure a .env file exists with the required environment variables.
let DB_CONN_STRING = process.env.DB_CONN_STRING || "";
const ENVIRONMENT = process.env.ENVIRONMENT || "local";
const PORT = process.env.PORT || 3001;

// Fetch secrets based on environment and Lambda settings
const fetchSecrets = async () => {
  DB_CONN_STRING =
    (await getSecret(`/${ENVIRONMENT}/mongodb/conn-string`)) || DB_CONN_STRING;
};

// Initialize the secrets and then export the config
const initConfig = async () => {
  if (ENVIRONMENT != "local") 
    await fetchSecrets();

  console.log("DB_CONN_STRING: ", DB_CONN_STRING);
  return {
    port: PORT,
    DB_CONN_STRING: DB_CONN_STRING,
    ENVIRONMENT: ENVIRONMENT,
  };
};

module.exports = initConfig;
