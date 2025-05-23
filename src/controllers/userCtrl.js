const User = require("../models/userModel");
const { logger } = require("../utils/logger");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    const firebase_id = req.firebaseUser.uid; // Get Firebase UID from the verified token

    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email is required.",
      });
    }

    // Check if user already exists in our database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User already exists.",
      });
    }

    // Create user in our database
    const newUser = new User({
      firebase_id,
      name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" "),
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
const getUser = async (req, res) => {
  try {
    // The user object is already set by the middleware
    const user = await User.findOne({ _id: req.user._id })
      .populate("cases")
      .populate("reports");

    if (!user) {
      logger.info(
        `USER -> GET SINGLE USER (ID: ${req.user._id}) = User not found.`,
      );
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    logger.info(
      `USER -> GET SINGLE USER (ID: ${req.user._id}) = User fetched successfully.`,
    );
    return res.status(200).json({
      status: 200,
      success: true,
      data: user,
    });
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    logger.error(
      `USER -> GET SINGLE USER (ID: ${req.user._id}) = Error: ${errorMessage}`,
    );
    return res.status(500).json({
      status: 500,
      success: false,
      message: errorMessage,
    });
  }
};

// Get user by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      logger.info(`USER -> GET USER BY EMAIL (${email}) = User not found.`);
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    logger.info(
      `USER -> GET USER BY EMAIL (${email}) = User fetched successfully.`,
    );
    return res.status(200).json({
      status: 200,
      success: true,
      data: user,
    });
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    logger.error(`USER -> GET USER BY EMAIL = Error: ${errorMessage}`);
    return res.status(500).json({
      status: 500,
      success: false,
      message: errorMessage,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: 200,
      success: true,
      data: users,
    });
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    logger.error("USER -> GET ALL USERS = Error: ${errorMessage}");
    return res.status(500).json({
      status: 500,
      success: false,
      message: errorMessage,
    });
  }
};

module.exports = { getUser, createUser, getUserByEmail, getAllUsers };
