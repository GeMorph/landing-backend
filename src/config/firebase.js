const admin = require("firebase-admin");
const { logger } = require("../utils/logger");
require("dotenv").config();
const { getConfig } = require("../config/config");

// Initialize Firebase Admin
const initializeFirebase = async () => {
  try {
    const config = getConfig();
    // Check if Firebase is already initialized
    if (!admin.apps.length) {
      const projectId = config.FIREBASE_PROJECT_ID;
      const clientEmail = config.FIREBASE_CLIENT_EMAIL;
      const privateKey = config.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n",
      );

      // Log credential availability (without sensitive data)
      logger.info(`Firebase credentials check:
        Project ID: ${projectId ? "Present" : "Missing"}
        Client Email: ${clientEmail ? "Present" : "Missing"}
        Private Key: ${privateKey ? "Present" : "Missing"}
      `);

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "Missing required Firebase credentials. Please check environment variables and AWS Secrets Manager.",
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    logger.info("Firebase initialization successful");
    return admin;
  } catch (error) {
    logger.error("Firebase initialization error:", error);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  admin,
};
