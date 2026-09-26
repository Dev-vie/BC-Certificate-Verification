const express = require("express");
const router = express.Router();
const { verifyTransporter, sendVerificationEmail } = require("../utils/sendEmail");

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/students", require("../modules/students/student.routes"));
router.use("/certificates", require("../modules/certificates/certificate.routes"));
router.use("/templates", require("../modules/templates/template.routes"));
router.use("/dashboard", require("../modules/dashboard/dashboard.routes"));
router.use("/verification", require("../modules/verification/verification.routes"));

// Diagnostic test endpoint for email configuration and connectivity
router.get("/test-email", async (req, res) => {
  const targetEmail = req.query.email;
  const diagnostics = {
    env: {
      EMAIL_HOST: process.env.EMAIL_HOST || "not set (defaulting to smtp.gmail.com)",
      EMAIL_PORT: process.env.EMAIL_PORT || "not set (defaulting to 587)",
      EMAIL_USER: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}...` : "not set",
      EMAIL_PASS: process.env.EMAIL_PASS ? "configured (hidden)" : "not set",
      EMAIL_FROM: process.env.EMAIL_FROM || "not set",
      RESEND_API_KEY: process.env.RESEND_API_KEY ? "configured (hidden)" : "not set",
      RESEND_FROM: process.env.RESEND_FROM || "not set",
      FRONTEND_URL: process.env.FRONTEND_URL || "not set",
    },
    smtpConnection: null,
    testEmail: {
      attempted: false,
      success: false,
      provider: null,
      error: null,
    }
  };

  // Check SMTP connection health
  const connectionCheck = await verifyTransporter();
  diagnostics.smtpConnection = connectionCheck;

  // Try sending a test email if parameter is provided
  if (targetEmail) {
    diagnostics.testEmail.attempted = true;
    try {
      console.log(`[Diagnostic Route] Request to send test verification email to: ${targetEmail}`);
      await sendVerificationEmail(targetEmail, "Test Student", "123456");
      diagnostics.testEmail.success = true;
      diagnostics.testEmail.provider = process.env.RESEND_API_KEY ? "resend" : "smtp";
    } catch (err) {
      console.error(`[Diagnostic Route Error] Test email failed:`, err);
      diagnostics.testEmail.success = false;
      diagnostics.testEmail.error = err.message || err;
    }
  }

  res.json(diagnostics);
});

module.exports = router;
