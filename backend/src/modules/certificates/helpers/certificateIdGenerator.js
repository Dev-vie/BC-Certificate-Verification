const { v4: uuidv4 } = require("uuid");

const generateCertificateId = () => {
  return "CERT-" + uuidv4().toUpperCase().slice(0, 8);
};

module.exports = { generateCertificateId };
