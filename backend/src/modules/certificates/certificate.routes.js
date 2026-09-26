const express = require("express");
const router = express.Router();
const {
  issueSingle,
  issueBulk,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  deleteCertificate,
} = require("./certificate.controller");
const { protect } = require("../../middleware/auth.middleware");
const { uploadCsv } = require("../../middleware/upload.middleware");
const { validateIssueSingle } = require("./certificate.validation");

/**
 * @swagger
 * /api/certificates/issue:
 *   post:
 *     summary: Issue a single certificate and store its hash on the blockchain
 *     tags:
 *       - Certificates
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - templateId
 *             properties:
 *               studentId:
 *                 type: string
 *               templateId:
 *                 type: string
 *               placeholderData:
 *                 type: object
 *                 description: Key-value pairs matching placeholders in the template
 *     responses:
 *       201:
 *         description: Certificate issued successfully and hash anchored to blockchain
 *       400:
 *         description: Bad request / validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/issue", protect, validateIssueSingle, issueSingle);

/**
 * @swagger
 * /api/certificates/issue-bulk:
 *   post:
 *     summary: Issue certificates in bulk using a CSV file upload
 *     tags:
 *       - Certificates
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - templateId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing student certificate data
 *               templateId:
 *                 type: string
 *                 description: The certificate template ID to use
 *     responses:
 *       200:
 *         description: Bulk issuance processing started successfully
 *       400:
 *         description: Bad request / CSV file missing
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/issue-bulk", protect, uploadCsv.single("file"), issueBulk);

/**
 * @swagger
 * /api/certificates:
 *   get:
 *     summary: Get all certificates issued by the logged-in institution
 *     tags:
 *       - Certificates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, getCertificates);

router.get("/test-email", async (req, res) => {
  const { sendVerificationEmail } = require("../../utils/sendEmail");
  const targetEmail = req.query.email || "gamilauthentic@gmail.com";
  try {
    await sendVerificationEmail(targetEmail, "Test User", "123456");
    return res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${targetEmail}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

/**
 * @swagger
 * /api/certificates/{id}:
 *   get:
 *     summary: Get details of a specific certificate
 *     tags:
 *       - Certificates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The certificate ID
 *     responses:
 *       200:
 *         description: Certificate details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, getCertificateById);

/**
 * @swagger
 * /api/certificates/{id}/revoke:
 *   patch:
 *     summary: Revoke an issued certificate on the blockchain
 *     tags:
 *       - Certificates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The certificate ID
 *     responses:
 *       200:
 *         description: Certificate revoked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/revoke", protect, revokeCertificate);

/**
 * @swagger
 * /api/certificates/{id}:
 *   delete:
 *     summary: Delete a certificate record
 *     tags:
 *       - Certificates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The certificate ID
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteCertificate);

module.exports = router;
