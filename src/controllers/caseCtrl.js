const Case = require("../models/caseModel");
const asyncHandler = require("express-async-handler");

// Get all cases
const getCases = asyncHandler(async (req, res) => {
  try {
    const cases = await Case.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      data: cases.map((caseItem) => ({
        id: caseItem._id,
        title: caseItem.title,
        description: caseItem.description,
        status: caseItem.status,
        priority: caseItem.priority,
        createdAt: caseItem.createdAt,
        createdBy: caseItem.createdBy,
        assignedTo: caseItem.assignedTo,
        attachments: caseItem.attachments,
      })),
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
});

// Get single case by ID
const getCaseById = asyncHandler(async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: caseItem._id,
        title: caseItem.title,
        description: caseItem.description,
        status: caseItem.status,
        priority: caseItem.priority,
        createdAt: caseItem.createdAt,
        createdBy: caseItem.createdBy,
        assignedTo: caseItem.assignedTo,
        attachments: caseItem.attachments,
      },
    });
  } catch (error) {
    console.error("Error fetching case:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch case",
      error: error.message,
    });
  }
});

// Create a new case
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

// Update a case
const updateCase = asyncHandler(async (req, res) => {
  try {
    const caseItem = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("createdBy", "name email");

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Case updated successfully",
      data: {
        id: caseItem._id,
        title: caseItem.title,
        description: caseItem.description,
        status: caseItem.status,
        priority: caseItem.priority,
        createdAt: caseItem.createdAt,
        createdBy: caseItem.createdBy,
        assignedTo: caseItem.assignedTo,
        attachments: caseItem.attachments,
      },
    });
  } catch (error) {
    console.error("Error updating case:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update case",
      error: error.message,
    });
  }
});

// Delete a case
const deleteCase = asyncHandler(async (req, res) => {
  try {
    const caseItem = await Case.findByIdAndDelete(req.params.id);

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting case:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete case",
      error: error.message,
    });
  }
});

module.exports = {
  getCases,
  getCaseById,
  submitCase,
  updateCase,
  deleteCase,
};
