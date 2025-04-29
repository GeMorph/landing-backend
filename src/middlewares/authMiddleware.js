const admin = require("firebase-admin");
const { getConfig } = require("../config/config");
const { logger } = require("../libs/logger");

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

    const idToken = Array.isArray(req.headers["firebase-token"])
      ? req.headers["firebase-token"][0]
      : req.headers["firebase-token"];

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;

    if (req.params.id && req.user?.uid !== req.params.id) {
      logger.info(
        `REQUEST -> (UID: ${req.user?.uid}, PARAM ID: ${req.params.id}) = Unauthorized access.`,
      );
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access.",
      });
    }

    if (!req.user.uid) {
      logger.info(`REQUEST -> (UID: ${req.user?.uid}) = Unauthorized access.`);
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access.",
      });
    }

    next();
  } catch (error) {
    logger.error("Error verifying ID token in middleware:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  validateToken,
};