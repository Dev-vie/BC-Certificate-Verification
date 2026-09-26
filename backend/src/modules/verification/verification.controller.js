const { verifyCertificate } = require("./verification.service");

const verify = async (req, res) => {
  try {
    const result = await verifyCertificate(req.params.certificateId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ valid: false, message: error.message || "Internal server error" });
  }
};

module.exports = { verify };
