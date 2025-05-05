// Get cases by user ID
const getCasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all cases where the user_id matches the provided userId
    const cases = await Case.find({ user_id: userId });

    res.json({
      success: true,
      data: cases,
    });
  } catch (error) {
    console.error("Error getting cases by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cases by user ID",
    });
  }
};

module.exports = {
  getCasesByUserId,
};
