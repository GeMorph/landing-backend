const Report = require("../models/reportModel");
const asyncHandler = require("express-async-handler");

// Get all reports
const getReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: reports.map((report) => ({
        id: report._id,
        title: report.title,
        description: report.description,
        type: report.type || "analysis",
        status: report.status,
        createdAt: report.createdAt,
        publishedAt:
          report.status === "completed" ? report.updatedAt : undefined,
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

// Create a new report
const createReport = asyncHandler(async (req, res) => {
  try {
    const newReport = await Report.create(req.body);
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

module.exports = {
  getReports,
  createReport,
  updateReport,
  deleteReport,
};
