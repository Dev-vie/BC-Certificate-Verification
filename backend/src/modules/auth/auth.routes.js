const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const {
  register,
  verifyEmail,
  login,
  googleCallback,
  refreshToken,
  logout,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  getProfile,
  updateProfile,
  get2faStatus,
  setup2fa,
  enable2fa,
  disable2fa,
  approve,
  reject,
} = require("./auth.controller");
const { validateRegister, validateLogin } = require("./auth.validation");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new institution user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minimum: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registered successfully. Please check your email for verification.
 *       400:
 *         description: Bad request / validation error
 *       500:
 *         description: Server error
 */
router.post("/register", validateRegister, register);
router.get("/approve", approve);
router.get("/reject", reject);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email address with 6-digit code
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired code / missing parameters
 *       500:
 *         description: Server error
 */
router.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and return token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Contains refreshToken cookie
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid credentials / validation error
 *       500:
 *         description: Server error
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using cookie
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Unauthorized / invalid refresh token
 *       500:
 *         description: Server error
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out user and clear refresh token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server error
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/verify-reset-code:
 *   post:
 *     summary: Verify password reset code
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset code verified successfully
 *       400:
 *         description: Invalid or expired reset code
 *       500:
 *         description: Server error
 */
router.post("/verify-reset-code", verifyResetCode);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with code
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minimum: 6
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired code
 *       500:
 *         description: Server error
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 login flow
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to Google authentication screen
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback endpoint
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects back to frontend with token and user details or error query params
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failed",
  }),
  googleCallback,
);

const { protect } = require("../../middleware/auth.middleware");

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently logged-in user profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me", protect, getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update currently logged-in user profile details
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/profile", protect, updateProfile);

/**
 * @swagger
 * /api/auth/2fa/status:
 *   get:
 *     summary: Get Two-Factor Authentication status
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA status retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/2fa/status", protect, get2faStatus);

/**
 * @swagger
 * /api/auth/2fa/setup:
 *   post:
 *     summary: Generate 2FA secret and QR code URL
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup details generated (secret & qrCodeUrl)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/2fa/setup", protect, setup2fa);

/**
 * @swagger
 * /api/auth/2fa/enable:
 *   post:
 *     summary: Enable 2FA after verification
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP code from authenticator app
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *       400:
 *         description: Invalid TOTP token
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/2fa/enable", protect, enable2fa);

/**
 * @swagger
 * /api/auth/2fa/disable:
 *   post:
 *     summary: Disable Two-Factor Authentication
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP code to confirm disabling 2FA
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
 *       400:
 *         description: Invalid TOTP token
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/2fa/disable", protect, disable2fa);

module.exports = router;
