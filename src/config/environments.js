const { getSecret } = require("../utils/getSecrets");
const dotenv = require("dotenv");

dotenv.config();
const ENVIRONMENT = process.env.ENVIRONMENT || "local";
let FIREBASE_SERVICE_ACCOUNT_JSON =
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "";
let FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || "";
let DB_CONN_STRING = process.env.DB_CONN_STRING || "";
let FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";
let FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || "";
let FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || "";
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
    FIREBASE_PROJECT_ID =
      (await getSecret(`/${ENVIRONMENT}/firebase/project-id`)) ||
      FIREBASE_PROJECT_ID;
    FIREBASE_CLIENT_EMAIL =
      (await getSecret(`/${ENVIRONMENT}/firebase/client-email`)) ||
      FIREBASE_CLIENT_EMAIL;
    FIREBASE_PRIVATE_KEY =
      (await getSecret(`/${ENVIRONMENT}/firebase/private-key`)) ||
      FIREBASE_PRIVATE_KEY;
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
    FIREBASE_WEB_API_KEY: FIREBASE_WEB_API_KEY,
    FIREBASE_SERVICE_ACCOUNT_JSON: FIREBASE_SERVICE_ACCOUNT_JSON,
    FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: FIREBASE_PRIVATE_KEY,
  };
};

module.exports = initConfig;
