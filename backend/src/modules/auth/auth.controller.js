const authService = require("./auth.service");
const isProduction = process.env.NODE_ENV === "production";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/auth", // only sent back on auth routes
};

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({
      message:
        "Registered successfully. Please check your email for the 6-digit verification code.",
      institution: result,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required" });
    const { refreshToken, ...result } = await authService.verifyEmail(
      email,
      code,
    );
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    return res
      .status(200)
      .json({ message: "Email verified successfully.", ...result });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { refreshToken, ...result } = await authService.login(req.body);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    return res.status(200).json({ message: "Login successful", ...result });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const googleCallback = async (req, res) => {
  try {
    const { refreshToken, token, institution } =
      await authService.loginWithGoogle(req.user);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    const redirectUrl = new URL(
      "/auth/google/callback",
      process.env.FRONTEND_URL,
    );
    redirectUrl.searchParams.set("token", token);

    redirectUrl.searchParams.set(
      "institution",
      Buffer.from(JSON.stringify(institution)).toString("base64"),
    );
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    const failUrl = new URL("/auth/login", process.env.FRONTEND_URL);
    failUrl.searchParams.set("error", error.message || "Google login failed");
    return res.redirect(failUrl.toString());
  }
};

const refreshToken = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    const { refreshToken: newRefreshToken, ...result } =
      await authService.refreshAccessToken(rawRefreshToken);
    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    return res.status(200).json({ message: "Token refreshed", ...result });
  } catch (error) {
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    await authService.logoutByRefreshToken(rawRefreshToken);
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(200).json({ message: "Logged out successfully" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    await authService.forgotPassword(email);
    return res.status(200).json({ message: "Reset code sent to your email." });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required" });
    await authService.verifyResetCode(email, code);
    return res
      .status(200)
      .json({ message: "Code verified. You can now reset your password." });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;
    if (!email || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    await authService.resetPassword(email, code, newPassword, confirmPassword);
    return res
      .status(200)
      .json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const institutionId = req.institution.id;
    const profile = await authService.getProfile(institutionId);
    return res.status(200).json({ institution: profile });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const institutionId = req.institution.id;
    const updated = await authService.updateProfile(institutionId, req.body);
    return res.status(200).json({
      message: "Profile updated successfully",
      institution: updated,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const get2faStatus = async (req, res) => {
  try {
    const institutionId = req.institution.id;
    const result = await authService.get2faStatus(institutionId);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const setup2fa = async (req, res) => {
  try {
    const institutionId = req.institution.id;
    const result = await authService.setup2fa(institutionId);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const enable2fa = async (req, res) => {
  try {
    const institutionId = req.institution.id;
    const { code, secret } = req.body;
    if (!code) return res.status(400).json({ message: "Verification code is required" });
    const result = await authService.enable2fa(institutionId, { code, secret });
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const disable2fa = async (req, res) => {
  try {
    const institutionId = req.institution.id;
    const { code } = req.body;
    const result = await authService.disable2fa(institutionId, { code });
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const approve = async (req, res) => {
  try {
    const { id, token } = req.query;
    if (!id || !token) {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 100px; color: #ef4444;">
          <h1>Approval Failed</h1>
          <p>Missing ID or approval token.</p>
        </div>
      `);
    }
    const result = await authService.approveInstitution(id, token);
    return res.status(200).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 100px; color: #3D876C; padding: 20px;">
        <div style="display: inline-block; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; max-width: 500px;">
          <h1 style="margin-top: 0;">Application Approved</h1>
          <p>Institution <strong>${result.name}</strong> (${result.email}) has been successfully approved.</p>
          <p>A notification email has been dispatched letting them know they can log in.</p>
        </div>
      </div>
    `);
  } catch (error) {
    return res.status(error.status || 500).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 100px; color: #ef4444; padding: 20px;">
        <div style="display: inline-block; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; max-width: 500px;">
          <h1 style="margin-top: 0;">Approval Error</h1>
          <p>${error.message || "Internal server error"}</p>
        </div>
      </div>
    `);
  }
};

const reject = async (req, res) => {
  try {
    const { id, token } = req.query;
    if (!id || !token) {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 100px; color: #ef4444;">
          <h1>Rejection Failed</h1>
          <p>Missing ID or token.</p>
        </div>
      `);
    }
    const result = await authService.rejectInstitution(id, token);
    return res.status(200).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 100px; color: #ef4444; padding: 20px;">
        <div style="display: inline-block; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; max-width: 500px;">
          <h1 style="margin-top: 0; color: #f97316;">Application Rejected</h1>
          <p>Institution <strong>${result.name}</strong> (${result.email}) has been successfully rejected.</p>
          <p>Their account record was deleted and a rejection email has been sent.</p>
        </div>
      </div>
    `);
  } catch (error) {
    return res.status(error.status || 500).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 100px; color: #ef4444; padding: 20px;">
        <div style="display: inline-block; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; max-width: 500px;">
          <h1 style="margin-top: 0;">Rejection Error</h1>
          <p>${error.message || "Internal server error"}</p>
        </div>
      </div>
    `);
  }
};

module.exports = {
  approve,
  reject,
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
};
