const express = require("express");
const router = express.Router();
const { verify } = require("./verification.controller");

/**
 * @swagger
 * /api/verification/{certificateId}:
 *   get:
 *     summary: Verify a certificate by ID or file hash
 *     description: Verifies the integrity of a certificate using its unique ID, checking both the PostgreSQL database and the blockchain.
 *     tags:
 *       - Verification
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID or file hash of the certificate
 *     responses:
 *       200:
 *         description: Verification details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Whether the certificate is valid
 *                 status:
 *                   type: string
 *                   enum: [VALID, INVALID, NOT_FOUND]
 *                   description: Verification status
 *                 certificate:
 *                   type: object
 *                 blockchain:
 *                   type: object
 *                 hash:
 *                   type: string
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
router.get("/:certificateId", verify);

module.exports = router;
