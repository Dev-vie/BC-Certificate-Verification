const QRCode = require("qrcode");

const generateQRCodeBuffer = async (certificateId) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;
  const buffer = await QRCode.toBuffer(certificateId, {
    errorCorrectionLevel: "H",
    width: 200,
    margin: 1,
  });
  return { buffer, verificationUrl };
};

module.exports = { generateQRCodeBuffer };
