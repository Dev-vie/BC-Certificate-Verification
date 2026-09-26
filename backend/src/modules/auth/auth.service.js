const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma = require("../../prisma/prismaClient");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../config/jwt");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendAdminApprovalEmail,
  sendApprovalNotificationEmail,
  sendRejectionNotificationEmail,
} = require("../../utils/sendEmail");
const { uploadFile } = require("../../utils/fileManager");

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const issueTokens = async (institution) => {
  const token = generateToken({ id: institution.id, email: institution.email });
  const refreshToken = generateRefreshToken({
    id: institution.id,
    email: institution.email,
  });

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  const refreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await prisma.institution.update({
    where: { id: institution.id },
    data: { refreshTokenHash, refreshTokenExpiry },
  });

  return { token, refreshToken };
};

const register = async ({ name, email, password }) => {
  const existing = await prisma.institution.findUnique({ where: { email } });
  if (existing) throw { status: 400, message: "Email already registered" };

  const hashedPassword = await bcrypt.hash(password, 10);
  const approveToken = crypto.randomBytes(32).toString("hex");
  const verifyCodeExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const institution = await prisma.institution.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verifyCode: approveToken,
      verifyCodeExpiry,
    },
  });

  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  const approveUrl = `${baseUrl}/api/auth/approve?id=${institution.id}&token=${approveToken}`;
  const rejectUrl = `${baseUrl}/api/auth/reject?id=${institution.id}&token=${approveToken}`;

  await sendAdminApprovalEmail(email, name, approveUrl, rejectUrl);

  return {
    id: institution.id,
    name: institution.name,
    email: institution.email,
  };
};

const verifyEmail = async (email, code) => {
  const institution = await prisma.institution.findFirst({
    where: { email, verifyCode: code, verifyCodeExpiry: { gt: new Date() } },
  });

  if (!institution) throw { status: 400, message: "Invalid or expired code" };

  await prisma.institution.update({
    where: { id: institution.id },
    data: { isVerified: true, verifyCode: null, verifyCodeExpiry: null },
  });

  const { token, refreshToken } = await issueTokens(institution);

  return {
    token,
    refreshToken,
    institution: {
      id: institution.id,
      name: institution.name,
      email: institution.email,
    },
  };
};

const login = async ({ email, password }) => {
  const institution = await prisma.institution.findUnique({ where: { email } });
  if (!institution) throw { status: 401, message: "Invalid email or password" };

  if (!institution.isVerified)
    throw {
      status: 403,
      message: "Please verify your email before logging in",
    };

  if (!institution.password)
    throw {
      status: 400,
      message:
        "This account was created with Google. Please sign in with Google.",
    };

  const isMatch = await bcrypt.compare(password, institution.password);
  if (!isMatch) throw { status: 401, message: "Invalid email or password" };

  const { token, refreshToken } = await issueTokens(institution);

  return {
    token,
    refreshToken,
    institution: {
      id: institution.id,
      name: institution.name,
      email: institution.email,
    },
  };
};

const loginWithGoogle = async (institution) => {
  const { token, refreshToken } = await issueTokens(institution);

  return {
    token,
    refreshToken,
    institution: {
      id: institution.id,
      name: institution.name,
      email: institution.email,
      avatar: institution.avatar,
    },
  };
};

const refreshAccessToken = async (rawRefreshToken) => {
  if (!rawRefreshToken)
    throw { status: 401, message: "No refresh token provided" };

  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw {
      status: 401,
      message: "Refresh token expired or invalid, please log in again",
    };
  }

  const institution = await prisma.institution.findUnique({
    where: { id: payload.id },
  });
  if (
    !institution ||
    !institution.refreshTokenHash ||
    !institution.refreshTokenExpiry
  ) {
    throw {
      status: 401,
      message: "Refresh token expired or invalid, please log in again",
    };
  }

  if (institution.refreshTokenExpiry < new Date()) {
    throw {
      status: 401,
      message: "Refresh token expired, please log in again",
    };
  }

  const matches = await bcrypt.compare(
    rawRefreshToken,
    institution.refreshTokenHash,
  );
  if (!matches) {
    throw {
      status: 401,
      message: "Refresh token expired or invalid, please log in again",
    };
  }

  const { token, refreshToken } = await issueTokens(institution);

  return {
    token,
    refreshToken,
    institution: {
      id: institution.id,
      name: institution.name,
      email: institution.email,
    },
  };
};

const logoutByRefreshToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) return;

  let payload;
  try {

    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    return;
  }

  await prisma.institution
    .update({
      where: { id: payload.id },
      data: { refreshTokenHash: null, refreshTokenExpiry: null },
    })
    .catch(() => {});
};

const forgotPassword = async (email) => {
  const institution = await prisma.institution.findUnique({ where: { email } });
  if (!institution) throw { status: 404, message: "Email not found" };

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.institution.update({
    where: { email },
    data: { resetCode, resetCodeExpiry },
  });

  await sendResetPasswordEmail(email, institution.name, resetCode);
};

const verifyResetCode = async (email, code) => {
  const institution = await prisma.institution.findFirst({
    where: { email, resetCode: code, resetCodeExpiry: { gt: new Date() } },
  });

  if (!institution) throw { status: 400, message: "Invalid or expired code" };
};

const resetPassword = async (email, code, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword)
    throw { status: 400, message: "Passwords do not match" };

  if (newPassword.length < 6)
    throw { status: 400, message: "Password must be at least 6 characters" };

  const institution = await prisma.institution.findFirst({
    where: { email, resetCode: code, resetCodeExpiry: { gt: new Date() } },
  });

  if (!institution) throw { status: 400, message: "Invalid or expired code" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.institution.update({
    where: { id: institution.id },
    data: { password: hashedPassword, resetCode: null, resetCodeExpiry: null },
  });
};

const getProfile = async (institutionId) => {
  const institution = await prisma.institution.findUnique({
    where: { id: Number(institutionId) },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      isVerified: true,
    },
  });
  if (!institution) throw { status: 404, message: "Institution not found" };
  return institution;
};

const updateProfile = async (institutionId, updateData) => {
  const data = {};
  if (updateData.name !== undefined) data.name = updateData.name;
  if (updateData.email !== undefined) data.email = updateData.email;
  if (updateData.avatar !== undefined) {
    if (
      updateData.avatar &&
      typeof updateData.avatar === "string" &&
      updateData.avatar.startsWith("data:image/")
    ) {
      try {
        const matches = updateData.avatar.match(
          /^data:image\/([a-zA-Z0-9]+);base64,(.+)$/,
        );
        if (matches) {
          const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          const fakeFile = {
            buffer,
            originalname: `avatar-${Date.now()}.${ext}`,
          };
          const publicUrl = await uploadFile(
            fakeFile,
            process.env.SUPABASE_CERTIFICATES_BUCKET || "certificates",
            `avatars/institution-${institutionId}`,
          );
          data.avatar = publicUrl;
        } else {
          data.avatar = updateData.avatar;
        }
      } catch (err) {
        console.warn("[Avatar Upload Warning] Storing avatar fallback:", err.message);
        data.avatar = updateData.avatar;
      }
    } else {
      data.avatar = updateData.avatar;
    }
  }

  const updated = await prisma.institution.update({
    where: { id: Number(institutionId) },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });
  return updated;
};

const {
  generateSecret,
  generate2FAQrCode,
  verifyTOTP,
} = require("../../utils/totp");

const get2faStatus = async (institutionId) => {
  const inst = await prisma.institution.findUnique({
    where: { id: Number(institutionId) },
    select: { twoFactorEnabled: true },
  });
  if (!inst) throw { status: 404, message: "Institution not found" };
  return { is2faEnabled: inst.twoFactorEnabled };
};

const setup2fa = async (institutionId) => {
  const inst = await prisma.institution.findUnique({
    where: { id: Number(institutionId) },
  });
  if (!inst) throw { status: 404, message: "Institution not found" };

  let secret = inst.twoFactorSecret;
  if (!secret) {
    secret = generateSecret();
    await prisma.institution.update({
      where: { id: Number(institutionId) },
      data: { twoFactorSecret: secret },
    });
  }

  const { qrCodeUrl } = await generate2FAQrCode(inst.email, secret);
  const secretFormatted = secret.match(/.{1,4}/g).join(" ");

  return {
    qrCodeUrl,
    secret,
    secretFormatted,
    is2faEnabled: inst.twoFactorEnabled,
  };
};

const enable2fa = async (institutionId, { code, secret }) => {
  const inst = await prisma.institution.findUnique({
    where: { id: Number(institutionId) },
  });
  if (!inst) throw { status: 404, message: "Institution not found" };

  const targetSecret = secret || inst.twoFactorSecret;
  if (!targetSecret) {
    throw { status: 400, message: "No 2FA secret setup. Please start setup again." };
  }

  const isValid = verifyTOTP(code, targetSecret);
  if (!isValid) {
    throw {
      status: 400,
      message: "Invalid 6-digit code. Please check your authenticator app and try again.",
    };
  }

  await prisma.institution.update({
    where: { id: Number(institutionId) },
    data: { twoFactorEnabled: true, twoFactorSecret: targetSecret },
  });

  return { message: "Two-factor authentication successfully enabled!", is2faEnabled: true };
};

const disable2fa = async (institutionId, { code }) => {
  const inst = await prisma.institution.findUnique({
    where: { id: Number(institutionId) },
  });
  if (!inst) throw { status: 404, message: "Institution not found" };

  if (inst.twoFactorSecret) {
    const isValid = verifyTOTP(code, inst.twoFactorSecret);
    if (!isValid) {
      throw {
        status: 400,
        message: "Invalid 6-digit code. Enter current authenticator code to disable.",
      };
    }
  }

  await prisma.institution.update({
    where: { id: Number(institutionId) },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  return { message: "Two-factor authentication disabled", is2faEnabled: false };
};

const approveInstitution = async (id, token) => {
  const parsedId = Number(id);
  if (isNaN(parsedId)) throw { status: 400, message: "Invalid institution ID" };

  const institution = await prisma.institution.findFirst({
    where: { id: parsedId, verifyCode: token, verifyCodeExpiry: { gt: new Date() } },
  });

  if (!institution) throw { status: 400, message: "Invalid, expired, or already processed approval token" };

  await prisma.institution.update({
    where: { id: parsedId },
    data: { isVerified: true, verifyCode: null, verifyCodeExpiry: null },
  });

  await sendApprovalNotificationEmail(institution.email, institution.name);

  return { name: institution.name, email: institution.email };
};

const rejectInstitution = async (id, token) => {
  const parsedId = Number(id);
  if (isNaN(parsedId)) throw { status: 400, message: "Invalid institution ID" };

  const institution = await prisma.institution.findFirst({
    where: { id: parsedId, verifyCode: token },
  });

  if (!institution) throw { status: 400, message: "Invalid, expired, or already processed rejection token" };

  await prisma.institution.delete({
    where: { id: parsedId },
  });

  await sendRejectionNotificationEmail(institution.email, institution.name);

  return { name: institution.name, email: institution.email };
};

module.exports = {
  approveInstitution,
  rejectInstitution,
  register,
  verifyEmail,
  login,
  loginWithGoogle,
  refreshAccessToken,
  logoutByRefreshToken,
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
