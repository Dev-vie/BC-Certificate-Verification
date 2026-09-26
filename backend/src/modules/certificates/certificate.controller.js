const certificateService = require("./certificate.service");

const issueSingle = async (req, res) => {
  try {
    const cert = await certificateService.issueSingle(
      req.institution.id,
      req.body,
    );
    return res
      .status(201)
      .json({ message: "Certificate issued successfully", certificate: cert });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const issueBulk = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "CSV file is required" });
    if (!req.body.templateId)
      return res.status(400).json({ message: "templateId is required" });

    const result = await certificateService.issueBulk(
      req.institution.id,
      req.body.templateId,
      req.file.buffer,
    );
    return res.status(201).json({ message: "Bulk issue completed", ...result });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getCertificates = async (req, res) => {
  try {
    const certs = await certificateService.getCertificates(req.institution.id);
    return res.status(200).json({ certificates: certs });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const cert = await certificateService.getCertificateById(
      req.params.id,
      req.institution.id,
    );
    return res.status(200).json({ certificate: cert });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const revokeCertificate = async (req, res) => {
  try {
    const cert = await certificateService.revokeCertificate(
      req.params.id,
      req.institution.id,
    );
    return res
      .status(200)
      .json({ message: "Certificate revoked successfully", certificate: cert });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    await certificateService.deleteCertificate(
      req.params.id,
      req.institution.id,
    );
    return res
      .status(200)
      .json({ message: "Certificate deleted successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  issueSingle,
  issueBulk,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  deleteCertificate,
};
