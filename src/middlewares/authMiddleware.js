const admin = require("firebase-admin");
const { getConfig } = require("../config/config");
const { logger } = require("../utils/logger");
const User = require("../models/userModel");

const initFirebase = async () => {
  try {
    const config = getConfig();
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(config.FIREBASE_SERVICE_ACCOUNT_JSON),
      ),
    });
  } catch (error) {
    logger.error(`Error initializing Firebase in middleware: ${error.message}`);
  }
};

const validateToken = async (req, res, next) => {
  try {
    if (!admin.apps.length) await initFirebase();

    // Log all headers for debugging
    logger.info("Request headers:", req.headers);

    // Get token from headers (case-insensitive)
    const idToken =
      req.headers["x-firebase-token"] ||
      req.headers["X-Firebase-Token"] ||
      req.headers["firebase-token"];

    logger.info(
      "Extracted token:",
      idToken ? "Token present" : "No token found",
    );

    if (!idToken) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Firebase token is required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    logger.info("Token decoded successfully for UID:", decodedToken.uid);

    // Find user in our database
    const user = await User.findOne({ firebase_id: decodedToken.uid });

    if (!user) {
      logger.info(`User not found in database for UID: ${decodedToken.uid}`);
      return res.status(401).json({
        status: 401,
        success: false,
        message: "User not found in database",
      });
    }

    // Set the user object with the database user
    req.user = user;

    if (req.params.id && req.user._id.toString() !== req.params.id) {
      logger.info(
        `REQUEST -> (UID: ${req.user._id}, PARAM ID: ${req.params.id}) = Unauthorized access.`,
      );
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access.",
      });
    }

    next();
  } catch (error) {
    logger.error("Error verifying ID token in middleware:", error);
    return res.status(403).json({
      status: 403,
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const validateAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "User not authenticated",
      });
    }

    if (req.user.role !== "admin") {
      logger.info(`Unauthorized admin access attempt by UID: ${req.user._id}`);
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    logger.error("Error in admin check middleware:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  validateToken,
  validateAdmin,
};
