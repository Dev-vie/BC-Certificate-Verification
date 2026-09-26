const express = require("express");
const router = express.Router();
const { getDashboard } = require("./dashboard.controller");
const { protect } = require("../../middleware/auth.middleware");

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics and overview data
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, getDashboard);

module.exports = router;
