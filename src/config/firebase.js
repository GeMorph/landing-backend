const admin = require("firebase-admin");
const { logger } = require("../utils/logger");
require("dotenv").config();

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }
    logger.info("Firebase initialization successfully")
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
