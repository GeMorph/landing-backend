const Report = require("../models/reportModel");
const asyncHandler = require("express-async-handler");
const Counter = require("../models/counterModel");

// Get all reports
const getReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate({
        path: "case",
        select: "caseNumber title user",
        populate: { path: "user", select: "name email" },
      })
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      reports: reports.map((report) => ({
        id: report._id,
        title: report.title,
        description: report.description,
        type: report.type || "analysis",
        status: report.status,
        created_at: report.createdAt,
        caseNumber: report.caseNumber,
        case: report.case
          ? {
              id: report.case._id,
              caseNumber: report.case.caseNumber,
              title: report.case.title,
              user: report.case.user,
            }
          : null,
        user: report.user
          ? {
              name: report.user.name,
              email: report.user.email,
            }
          : null,
        submittedBy: report.createdBy
          ? {
              name: report.createdBy.name,
              email: report.createdBy.email,
            }
          : null,
        attachments: report.attachments || [],
      })),
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});

const createReport = asyncHandler(async (req, res) => {
  try {
    // Get the next report number
    const counter = await Counter.findOneAndUpdate(
      { name: "reportNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const reportData = {
      ...req.body,
      user: req.body.user,
      createdBy: req.user._id,
      caseNumber: counter.seq,
    };

    const newReport = await Report.create(reportData);
    await require("../models/userModel").findByIdAndUpdate(req.body.user, {
      $push: { reports: newReport._id },
    });
    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: newReport,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create report",
      error: error.message,
    });
  }
});

// Update a report
const updateReport = asyncHandler(async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update report",
      error: error.message,
    });
  }
});

// Delete a report
const deleteReport = asyncHandler(async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete report",
      error: error.message,
    });
  }
});

const getReportById = asyncHandler(async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        id: report._id,
        title: report.title,
        description: report.description,
        type: report.type,
        status: report.status,
        created_at: report.createdAt,
        user: {
          name: report.user.name,
          email: report.user.email,
        },
        caseNumber: report.caseNumber,
        attachments: report.attachments || [],
      },
    });
  } catch (error) {
    console.error("Error fetching report by id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });
  }
});

module.exports = {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getReportById,
};
