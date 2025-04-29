const admin = require("firebase-admin");
const User = require("../models/User"); // Adjust path if needed
const { logger } = require("../libs/logger");

// Create a new user
const createUser = async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);

    const name = userRecord.displayName || "";
    const email = userRecord.email;

    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email is required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User already exists.",
      });
    }

    const newUser = new User({
      firebase_id: req.user.uid,
      name,
      email,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      status: 201,
      success: true,
      message: "User created successfully.",
      data: savedUser,
    });
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    logger.error(`USER -> CREATE USER = Error: ${errorMessage}`);
    return res.status(500).json({
      status: 500,
      success: false,
      message: errorMessage,
    });
  }
};

// Get a single user by Firebase UID
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ firebase_id: req.params.id })
      .populate("cases")
      .populate("reports");

    if (!user) {
      logger.info(
        `USER -> GET SINGLE USER (PARAM ID: ${req.params.id}) = User not found.`,
      );
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    logger.info(
      `USER -> GET SINGLE USER (PARAM ID: ${req.params.id}) = User fetched successfully.`,
    );
    return res.status(200).json({
      status: 200,
      success: true,
      data: user,
    });
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    logger.error(
      `USER -> GET SINGLE USER (PARAM ID: ${req.params.id}) = Error: ${errorMessage}`,
    );
    return res.status(500).json({
      status: 500,
      success: false,
      message: errorMessage,
    });
  }
};

module.exports = {getSingleUser, createUser};