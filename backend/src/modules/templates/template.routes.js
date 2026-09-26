const express = require("express");
const router = express.Router();
const {
  createTemplate,
  getTemplates,
  updateTemplatePlaceholders,
  deleteTemplate,
} = require("./template.controller");
const { protect } = require("../../middleware/auth.middleware");
const { uploadTemplate } = require("../../middleware/upload.middleware");

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Upload and create a new certificate template (HTML/Word/PDF)
 *     tags:
 *       - Templates
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
 *               - name
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Template file
 *               name:
 *                 type: string
 *                 description: Template name
 *     responses:
 *       201:
 *         description: Template created successfully
 *       400:
 *         description: Bad request / file missing
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", protect, uploadTemplate.single("file"), createTemplate);

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: Get all certificate templates for the logged-in institution
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of templates retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, getTemplates);

/**
 * @swagger
 * /api/templates/{id}:
 *   patch:
 *     summary: Update placeholders/metadata of a specific template
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placeholders:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", protect, updateTemplatePlaceholders);

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete a certificate template
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteTemplate);

module.exports = router;
