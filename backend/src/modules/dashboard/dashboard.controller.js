const dashboardService = require("./dashboard.service");

const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboard(req.institution.id);
    return res.status(200).json({ dashboard: data });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = { getDashboard };
