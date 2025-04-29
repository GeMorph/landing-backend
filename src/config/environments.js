const { getSecret } = require("../utils/getSecrets");
const dotenv = require("dotenv");

dotenv.config();
const ENVIRONMENT = process.env.ENVIRONMENT || "local";
let FIREBASE_SERVICE_ACCOUNT_JSON =
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "";
let FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || "";
let DB_CONN_STRING = process.env.DB_CONN_STRING || "";
const PORT = process.env.PORT || 3001;
// Fetch secrets based on environment and Lambda settings
const fetchSecrets = async () => {
  if (ENVIRONMENT !== "local") {
    DB_CONN_STRING =
      (await getSecret(`/${ENVIRONMENT}/mongodb/conn-string`)) ||
      DB_CONN_STRING;
    FIREBASE_WEB_API_KEY =
      (await getSecret(`/${ENVIRONMENT}/firebase/web-api-key-json`)) ||
      FIREBASE_WEB_API_KEY;
    FIREBASE_SERVICE_ACCOUNT_JSON =
      (await getSecret(`/${ENVIRONMENT}/firebase/service-account-json`)) ||
      FIREBASE_SERVICE_ACCOUNT_JSON;
  }
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
