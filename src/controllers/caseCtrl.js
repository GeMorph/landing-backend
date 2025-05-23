const Case = require("../models/caseModel");
const asyncHandler = require("express-async-handler");
const Counter = require("../models/counterModel");

// Get all cases
const getCases = asyncHandler(async (req, res) => {
  try {
    const cases = await Case.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "_id name email",
      })
      .populate({
        path: "assignedTo",
        select: "_id name email",
      });

    res.status(200).json({
      success: true,
      data: cases.map((caseItem) => ({
        id: caseItem._id,
        title: caseItem.title,
        description: caseItem.description,
        priority: caseItem.priority,
        status: caseItem.status,
        createdAt: caseItem.createdAt,
        tags: caseItem.tags,
        dnaFile: caseItem.dnaFile,
        assignedTo: caseItem.assignedTo,
        dueDate: caseItem.dueDate,
        user: caseItem.user,
        caseNumber: caseItem.caseNumber,
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
        caseNumber: caseItem.caseNumber,
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
const createCase = asyncHandler(async (req, res) => {
  try {
    const { title, description, priority, status, tags, dueDate, dnaFile } =
      req.body;

    // Get the next case number
    const counter = await Counter.findOneAndUpdate(
      { name: "caseNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const newCase = await Case.create({
      title,
      description,
      priority,
      status,
      tags,
      dueDate,
      dnaFile,
      user: req.user._id,
      caseNumber: counter.seq,
    });

    await require("../models/userModel").findByIdAndUpdate(req.user._id, {
      $push: { cases: newCase._id },
    });

    res.status(201).json({
      success: true,
      message: "Case created successfully",
      data: newCase,
    });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create case",
      error: error.message,
    });
  }
});

// Update a case
const updateCase = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      tags,
      dueDate,
      dnaFile,
      assignedTo,
    } = req.body;

    const caseItem = await Case.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        status,
        tags,
        dueDate,
        dnaFile,
        assignedTo,
      },
      { new: true },
    ).populate({
      path: "assignedTo",
      select: "_id name email",
    });

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Case updated successfully",
      data: caseItem,
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

// Get cases by user ID
const getCasesByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const cases = await Case.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      data: cases.map((caseItem) => ({
        id: caseItem._id,
        title: caseItem.title,
        description: caseItem.description,
        priority: caseItem.priority,
        status: caseItem.status,
        createdAt: caseItem.createdAt,
        tags: caseItem.tags,
        dnaFile: caseItem.dnaFile,
        assignedTo: caseItem.assignedTo,
        dueDate: caseItem.dueDate,
        caseNumber: caseItem.caseNumber,
      })),
    });
  } catch (error) {
    console.error("Error fetching cases by user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cases by user",
      error: error.message,
    });
  }
});

module.exports = {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  getCasesByUserId,
};
