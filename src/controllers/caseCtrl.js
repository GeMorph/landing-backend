const Case = require("../models/caseModel");
const asyncHandler = require("express-async-handler");

const submitCase = asyncHandler(async (req, res) => {
  try {
    const newCase = await Case.create(req.body);
    res.status(201).json({
      success: true,
      status: 201,
      message: "Case submitted successfully",
      data: newCase,
    }); 
  } catch (error) {
    console.error("Error submitting case:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = { submitCase };
