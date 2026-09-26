const axios = require("axios");
const nodemailer = require("nodemailer");
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  RESEND_API_KEY,
  RESEND_FROM,
  BREVO_API_KEY,
  BREVO_FROM_EMAIL,
  BREVO_FROM_NAME,
  SENDGRID_API_KEY,
  SENDGRID_FROM,
  FRONTEND_URL,
} = require("../config/env");
const QRCode = require("qrcode");

const fromAddress = EMAIL_FROM || EMAIL_USER || "noreply@authentix.com";

const createDynamicTransporter = () => {
  const host = process.env.EMAIL_HOST || EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || EMAIL_PORT) || 465;
  const user = process.env.EMAIL_USER || EMAIL_USER;
  const pass = process.env.EMAIL_PASS || EMAIL_PASS;

  const isGmail = host.includes("gmail");

  return nodemailer.createTransport(
    isGmail
      ? {
          service: "gmail",
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 8000,
          tls: { rejectUnauthorized: false },
        }
      : {
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
          connectionTimeout: 8000,
          greetingTimeout: 8000,
          socketTimeout: 8000,
          tls: { rejectUnauthorized: false },
        }
  );
};

const verifyTransporter = async () => {
  const host = process.env.EMAIL_HOST || EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || EMAIL_PORT) || 465;
  const user = process.env.EMAIL_USER || EMAIL_USER;

  console.log(`[SMTP Diagnostics] Testing connection with host=${host}, port=${port}, user=${user}`);
  const transporter = createDynamicTransporter();
  try {
    await transporter.verify();
    console.log("[SMTP Diagnostics] Connection test successful!");
    return { success: true };
  } catch (error) {
    console.error("[SMTP Diagnostics] Connection test failed:", error.message || error);
    return { success: false, error: error.message || error };
  }
};

/**
 * Diagnostic logger to verify email configuration in deployed environment (without leaking secrets)
 */
const logEmailConfigStatus = () => {
  console.log("----------------- EMAIL CONFIG STATUS -----------------");
  const hasBrevo = Boolean(process.env.BREVO_API_KEY || BREVO_API_KEY);
  const hasResend = Boolean(process.env.RESEND_API_KEY || RESEND_API_KEY);
  console.log(`[Email Config] BREVO_API_KEY:  ${hasBrevo ? `SET (prefix: ${(process.env.BREVO_API_KEY || BREVO_API_KEY).slice(0, 10)}...)` : "MISSING"}`);
  console.log(`[Email Config] BREVO_FROM:     ${process.env.BREVO_FROM_EMAIL || BREVO_FROM_EMAIL || EMAIL_USER || "gamilauthentic@gmail.com"}`);
  console.log(`[Email Config] RESEND_API_KEY: ${hasResend ? `SET (prefix: ${(process.env.RESEND_API_KEY || RESEND_API_KEY).slice(0, 7)}...)` : "MISSING"}`);
  console.log(`[Email Config] EMAIL_HOST:     ${process.env.EMAIL_HOST || EMAIL_HOST || "(default: smtp.gmail.com)"}`);
  console.log(`[Email Config] EMAIL_USER:     ${process.env.EMAIL_USER || EMAIL_USER ? `SET (${process.env.EMAIL_USER || EMAIL_USER})` : "MISSING"}`);
  let mode = "Direct SMTP (Nodemailer)";
  if (hasBrevo) mode = "Brevo HTTPS API (100% Free - sends to any Gmail)";
  else if (hasResend) mode = "Resend HTTPS API";
  console.log(`[Email Config] Active Mode:    ${mode}`);
  console.log("-------------------------------------------------------");
};

/**
 * Universal email sender that prioritizes Brevo HTTPS API (free for any email),
 * then Resend HTTPS API, and finally falls back to Nodemailer SMTP.
 */
const sendMailWrapper = async ({ from, to, subject, html, replyTo, attachments }) => {
  const toArray = Array.isArray(to) ? to : [to];
  const targetEmail = toArray[0];

  // 1. TRY BREVO HTTPS REST API (Works for any Gmail address for free without custom domain)
  const brevoApiKey = process.env.BREVO_API_KEY || BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const brevoSenderEmail = process.env.BREVO_FROM_EMAIL || BREVO_FROM_EMAIL || EMAIL_USER || "gamilauthentic@gmail.com";
      const brevoSenderName = process.env.BREVO_FROM_NAME || BREVO_FROM_NAME || "Authentix";

      const brevoPayload = {
        sender: { name: brevoSenderName, email: brevoSenderEmail },
        to: toArray.map((emailAddr) => ({ email: emailAddr })),
        subject,
        htmlContent: html,
      };

      if (replyTo) {
        brevoPayload.replyTo = { email: replyTo };
      }

      if (attachments && attachments.length > 0) {
        brevoPayload.attachment = attachments.map((att) => ({
          name: att.filename,
          content: Buffer.isBuffer(att.content)
            ? att.content.toString("base64")
            : att.content,
        }));
      }

      const response = await axios.post("https://api.brevo.com/v3/smtp/email", brevoPayload, {
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(`[Brevo Email Success] Successfully sent email to ${targetEmail} (MessageId: ${response.data?.messageId})`);
      return response.data;
    } catch (brevoErr) {
      const errMsg =
        brevoErr.response?.data?.message ||
        brevoErr.response?.data?.error ||
        brevoErr.message;
      console.warn(
        `[Brevo Warning] Brevo send to ${targetEmail} failed (Status: ${brevoErr.response?.status}): ${errMsg}. Falling back...`
      );
    }
  }

  // 2. TRY SENDGRID HTTPS API
  const sendgridApiKey = process.env.SENDGRID_API_KEY || SENDGRID_API_KEY;
  if (sendgridApiKey) {
    try {
      const sendgridSender = process.env.SENDGRID_FROM || SENDGRID_FROM || EMAIL_USER || "gamilauthentic@gmail.com";
      const payload = {
        personalizations: [{ to: toArray.map((e) => ({ email: e })) }],
        from: { email: sendgridSender, name: "Authentix" },
        subject,
        content: [{ type: "text/html", value: html }],
      };

      if (replyTo) {
        payload.reply_to = { email: replyTo };
      }

      if (attachments && attachments.length > 0) {
        payload.attachments = attachments.map((att) => ({
          filename: att.filename,
          content: Buffer.isBuffer(att.content)
            ? att.content.toString("base64")
            : Buffer.from(att.content).toString("base64"),
          type: att.contentType || "image/png",
          disposition: "attachment",
          content_id: att.cid,
        }));
      }

      await axios.post("https://api.sendgrid.com/v3/mail/send", payload, {
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`[SendGrid Email Success] Successfully sent email to ${targetEmail}`);
      return { success: true, provider: "sendgrid" };
    } catch (sgErr) {
      const sgMsg =
        sgErr.response?.data?.errors?.[0]?.message ||
        sgErr.response?.data?.message ||
        sgErr.message;
      console.warn(
        `[SendGrid Warning] SendGrid send to ${targetEmail} failed (Status: ${sgErr.response?.status}): ${sgMsg}. Falling back...`
      );
    }
  }

  // 3. TRY RESEND HTTPS API
  const resendApiKey = process.env.RESEND_API_KEY || RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resendFrom =
        process.env.RESEND_FROM ||
        (from && from.includes("<") && !from.includes("gmail.com")
          ? from
          : "Authentix <onboarding@resend.dev>");

      const payload = {
        from: resendFrom,
        to: toArray,
        subject,
        html,
      };
      if (replyTo) payload.reply_to = replyTo;
      if (attachments && attachments.length > 0) {
        payload.attachments = attachments.map((att) => ({
          filename: att.filename,
          content: Buffer.isBuffer(att.content)
            ? att.content.toString("base64")
            : att.content,
          content_type: att.contentType || "application/octet-stream",
        }));
      }

      const response = await axios.post("https://api.resend.com/emails", payload, {
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
      });
      console.log(`[Resend Email] Successfully sent email to ${targetEmail} (ID: ${response.data?.id})`);
      return response.data;
    } catch (resendErr) {
      const resendErrMsg =
        resendErr.response?.data?.message ||
        resendErr.response?.data?.error ||
        resendErr.message;
      console.warn(
        `[Resend Warning] Resend send to ${targetEmail} failed (Status: ${resendErr.response?.status}): ${resendErrMsg}. Falling back to SMTP...`
      );
    }
  }

  // 4. FALLBACK TO DIRECT SMTP
  try {
    const transporter = createDynamicTransporter();
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      replyTo,
      attachments,
    });
    console.log(`[SMTP Email] Successfully sent email to ${targetEmail} via SMTP`);
    return result;
  } catch (smtpErr) {
    console.error(
      `[Email Send Fatal Error] All email methods failed for recipient "${targetEmail}". Error: ${smtpErr.message}`,
      smtpErr
    );
    throw smtpErr;
  }
};

const sendVerificationEmail = async (email, name, code) => {
  await sendMailWrapper({
    from: `"Authentix" <${fromAddress}>`,
    to: email,
    subject: "Your Verification Code - Authentix",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello, ${name}!</h2>
        <p>Thank you for registering with Authentix.</p>
        <p>Your verification code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                    background: #f4f4f4; padding: 20px; text-align: center;
                    border-radius: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not register, please ignore this email.</p>
      </div>
    `,
  });
};

const sendResetPasswordEmail = async (email, name, code) => {
  await sendMailWrapper({
    from: `"Authentix" <${fromAddress}>`,
    to: email,
    subject: "Reset Your Password - Authentix",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello, ${name}!</h2>
        <p>You requested to reset your password.</p>
        <p>Your reset code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                    background: #f4f4f4; padding: 20px; text-align: center;
                    border-radius: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

const sendCertificateIssuedEmail = async (
  email,
  name,
  certDetails,
  senderEmail,
  senderName,
  template,
  senderAvatar,
) => {
  console.log(`[sendEmail] Starting certificate email workflow for: "${email}" (${name})`);
  if (!email || !email.includes("@")) {
    console.warn(`[sendEmail] Invalid or missing email: "${email}". Aborting send.`);
    return;
  }

  const { certificateId, course, issueDate, pdfPath, qrCode, qrImageUrl } = certDetails;
  const formattedDate = issueDate
    ? new Date(issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const fromHeader = `"${senderName || "Authentix"}" <${fromAddress}>`;
  const replyToHeader = senderEmail
    ? `"${senderName || "Authentix"}" <${senderEmail}>`
    : fromAddress;

  let placeholdersObj = {};
  if (template && template.placeholders) {
    if (typeof template.placeholders === "string") {
      try {
        placeholdersObj = JSON.parse(template.placeholders);
      } catch {
        placeholdersObj = {};
      }
    } else if (typeof template.placeholders === "object" && !Array.isArray(template.placeholders)) {
      placeholdersObj = template.placeholders;
    }
  }

  let rawSubject =
    placeholdersObj.emailSubject ||
    `Congratulations [Recipient Name]! Your Certificate for [Course / Program] Has Been Issued`;

  let rawBody =
    placeholdersObj.emailContent ||
    `<p>Dear [Recipient Name],</p><p>Congratulations! Your official certificate for <strong>[Course / Program]</strong> has been issued and anchored on the blockchain.</p><p>[QR Code]</p>`;

  const qrData = certificateId || "N/A";

  const qrBuffer = await QRCode.toBuffer(qrData, {
    errorCorrectionLevel: "H",
    width: 200,
    margin: 1,
  });

  const frontendBase = (process.env.FRONTEND_URL || FRONTEND_URL || "https://bc-certificate-verification-fronten.vercel.app").replace(/\/+$/, "");
  const verificationUrl = qrCode || `${frontendBase}/verify/${certificateId}`;

  // Reliable HTTPS QR Code image URL that Gmail Image Proxy & all email clients render without blocking
  const reliableQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;

  const qrCodeHtml = `<div style="display: block; text-align: center; margin: 20px 0;">
    <a href="${verificationUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
      <img src="${reliableQrImageUrl}" alt="Scan or Click QR Code to Verify Certificate" width="140" height="140" style="width: 140px; height: 140px; border-radius: 12px; border: 1px solid #e2e8f0; padding: 6px; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: inline-block;" />
    </a>
    <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b; font-weight: 500;">
      <a href="${verificationUrl}" target="_blank" style="color: #3D876C; text-decoration: none; font-weight: 600;">Scan QR Code or Click to verify online &rarr;</a>
    </p>
  </div>`;

  const isValidAvatarUrl =
    senderAvatar &&
    typeof senderAvatar === "string" &&
    (senderAvatar.startsWith("http://") || senderAvatar.startsWith("https://"));

  const logoHtml = isValidAvatarUrl
    ? `<img src="${senderAvatar}" alt="Logo" style="height: 48px; width: auto; vertical-align: middle; border-radius: 8px;" />`
    : "";
  const avatarHtml = isValidAvatarUrl
    ? `<img src="${senderAvatar}" alt="Avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; vertical-align: middle;" />`
    : "";

  const replacements = {
    "{{Recipient Name}}": name || "Student",
    "{{Name}}": name || "Student",
    "{{recipientName}}": name || "Student",
    "{{name}}": name || "Student",
    "[Recipient Name]": name || "Student",
    "[Name]": name || "Student",
    "[recipientName]": name || "Student",
    "[name]": name || "Student",
    "{Recipient Name}": name || "Student",
    "{Name}": name || "Student",
    "{recipientName}": name || "Student",
    "{name}": name || "Student",

    "{{Recipient Email}}": email,
    "{{Email}}": email,
    "{{email}}": email,
    "[Recipient Email]": email,
    "[Email]": email,
    "[email]": email,
    "{Recipient Email}": email,
    "{Email}": email,
    "{email}": email,

    "{{Student ID}}": certDetails.recipientId || "N/A",
    "{{StudentId}}": certDetails.recipientId || "N/A",
    "{{Recipient ID}}": certDetails.recipientId || "N/A",
    "{{RecipientId}}": certDetails.recipientId || "N/A",
    "{{recipientId}}": certDetails.recipientId || "N/A",
    "[Student ID]": certDetails.recipientId || "N/A",
    "[StudentId]": certDetails.recipientId || "N/A",
    "[Recipient ID]": certDetails.recipientId || "N/A",
    "[RecipientId]": certDetails.recipientId || "N/A",
    "[recipientId]": certDetails.recipientId || "N/A",
    "{Student ID}": certDetails.recipientId || "N/A",
    "{StudentId}": certDetails.recipientId || "N/A",
    "{Recipient ID}": certDetails.recipientId || "N/A",
    "{RecipientId}": certDetails.recipientId || "N/A",
    "{recipientId}": certDetails.recipientId || "N/A",

    "{{Course / Program}}": course || "Completed Program",
    "{{Course}}": course || "Completed Program",
    "{{Program}}": course || "Completed Program",
    "{{course}}": course || "Completed Program",
    "[Course / Program]": course || "Completed Program",
    "[Course]": course || "Completed Program",
    "[Program]": course || "Completed Program",
    "[course]": course || "Completed Program",
    "{Course / Program}": course || "Completed Program",
    "{Course}": course || "Completed Program",
    "{Program}": course || "Completed Program",
    "{course}": course || "Completed Program",

    "{{Grade}}": certDetails.grade || "Pass",
    "{{grade}}": certDetails.grade || "Pass",
    "[Grade]": certDetails.grade || "Pass",
    "[grade]": certDetails.grade || "Pass",
    "{Grade}": certDetails.grade || "Pass",
    "{grade}": certDetails.grade || "Pass",

    "{{Certificate ID}}": certificateId || "N/A",
    "{{CertificateId}}": certificateId || "N/A",
    "{{ID}}": certificateId || "N/A",
    "[Certificate ID]": certificateId || "N/A",
    "[CertificateId]": certificateId || "N/A",
    "[ID]": certificateId || "N/A",
    "{Certificate ID}": certificateId || "N/A",
    "{CertificateId}": certificateId || "N/A",
    "{ID}": certificateId || "N/A",

    "{{Issue Date}}": formattedDate,
    "{{Date}}": formattedDate,
    "{{issueDate}}": formattedDate,
    "[Issue Date]": formattedDate,
    "[Date]": formattedDate,
    "[issueDate]": formattedDate,
    "{Issue Date}": formattedDate,
    "{Date}": formattedDate,
    "{issueDate}": formattedDate,

    "{{Institution Name}}": senderName || "Authentix Institution",
    "{{Institution}}": senderName || "Authentix Institution",
    "{{institutionName}}": senderName || "Authentix Institution",
    "[Institution Name]": senderName || "Authentix Institution",
    "[Institution]": senderName || "Authentix Institution",
    "[institutionName]": senderName || "Authentix Institution",
    "{Institution Name}": senderName || "Authentix Institution",
    "{Institution}": senderName || "Authentix Institution",
    "{institutionName}": senderName || "Authentix Institution",

    "{{Institution Logo}}": logoHtml,
    "{{Institution Avatar}}": avatarHtml,
    "{{Logo}}": logoHtml,
    "{{Avatar}}": avatarHtml,
    "[Institution Logo]": logoHtml,
    "[Institution Avatar]": avatarHtml,
    "[Logo]": logoHtml,
    "[Avatar]": avatarHtml,

    "{{QR Code}}": qrCodeHtml,
    "{{QR_Code}}": qrCodeHtml,
    "{{qrCode}}": qrCodeHtml,
    "{{QR}}": qrCodeHtml,
    "[QR Code]": qrCodeHtml,
    "[QR_Code]": qrCodeHtml,
    "[qrCode]": qrCodeHtml,
    "[QR]": qrCodeHtml,
    "{QR Code}": qrCodeHtml,
    "{QR_Code}": qrCodeHtml,
    "{qrCode}": qrCodeHtml,
    "{QR}": qrCodeHtml,
  };

  Object.keys(replacements).forEach((key) => {
    const val = replacements[key];
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    rawSubject = rawSubject.replace(regex, val);
    rawBody = rawBody.replace(regex, val);
  });

  try {
    const res = await sendMailWrapper({
      from: fromHeader,
      replyTo: replyToHeader,
      to: email,
      subject: rawSubject,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrBuffer,
          cid: "qrcode",
        },
      ],
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- Header Bar with Institution Profile Picture / Logo -->
          <div style="background: linear-gradient(135deg, #3D876C 0%, #2C6450 100%); padding: 26px 32px; text-align: center;">
            ${
              isValidAvatarUrl
                ? `<div style="margin-bottom: 12px;">
                    <img src="${senderAvatar}" alt="" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: inline-block;" />
                   </div>`
                : `<div style="width: 56px; height: 56px; border-radius: 50%; background-color: #ffffff; color: #3D876C; font-size: 24px; font-weight: 700; line-height: 56px; margin: 0 auto 12px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15); text-align: center; display: inline-block;">
                    ${(senderName || "I").charAt(0).toUpperCase()}
                   </div>`
            }
            <h1 style="color: #ffffff; font-size: 19px; font-weight: 700; margin: 0; letter-spacing: -0.2px;">
              ${senderName || "Official Certificate Notice"}
            </h1>
          </div>

          <!-- User Customized Email Body -->
          <div style="padding: 32px 32px 24px 32px; color: #334155; font-size: 15px; line-height: 1.7;">
            ${rawBody}
          </div>

          <!-- PDF Download Action Button -->
          ${
            pdfPath
              ? `<div style="padding: 0 32px 32px 32px; text-align: center;">
                  <a href="${pdfPath}" target="_blank" style="display: inline-block; background-color: #3D876C; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 13px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(61, 135, 108, 0.25);">
                    View & Download Certificate (PDF)
                  </a>
                 </div>`
              : ""
          }

          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
              Sent directly by <strong>${senderName || "your institution"}</strong> via Authentix Certificate Verification System.<br />
              Please retain this email for your official academic records.
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[Email Success] Certificate email successfully sent to ${email} (from: ${fromHeader})`);
    return res;
  } catch (err) {
    console.error(
      `[Email Error] Failed to send certificate email to ${email}:`,
      err.response?.data || err.message
    );
    throw err;
  }
};

const sendAdminApprovalEmail = async (instEmail, instName, approveUrl, rejectUrl) => {
  const emailFrom = process.env.EMAIL_FROM || "gamilauthentic@gmail.com";
  await sendMailWrapper({
    from: `"Authentix System" <${emailFrom}>`,
    to: "gamilauthentic@gmail.com",
    subject: `New Registration Request: ${instName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff; color: #1e293b;">
        <h2 style="color: #3D876C; margin-top: 0; font-size: 20px;">New Institution Registration Request</h2>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p>A new institution has registered on the Authentix platform and is pending approval:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #64748b;">Institution Name:</td>
            <td style="padding: 8px 0; color: #0f172a;">${instName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Contact Email:</td>
            <td style="padding: 8px 0; color: #0f172a;">${instEmail}</td>
          </tr>
        </table>
        <p style="margin-bottom: 24px;">Please review the application and click one of the actions below to approve or reject the request:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${approveUrl}" style="background-color: #3D876C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 16px; display: inline-block;">Approve Request</a>
          <a href="${rejectUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reject Request</a>
        </div>
        <p style="color: #64748b; font-size: 12px;">This link is secure and valid for the verification process of the registered institution.</p>
      </div>
    `,
  });
};

const sendApprovalNotificationEmail = async (email, name) => {
  const emailFrom = process.env.EMAIL_FROM || "gamilauthentic@gmail.com";
  await sendMailWrapper({
    from: `"Authentix Support" <${emailFrom}>`,
    to: email,
    subject: "Your Authentix Account Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff; color: #1e293b;">
        <h2 style="color: #3D876C; margin-top: 0;">Congratulations, ${name}!</h2>
        <p>Your registration request for the Authentix Certificate Verification platform has been reviewed and approved by the system administrator.</p>
        <p>You can now log in to your dashboard to design templates and issue certificate credentials:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.FRONTEND_URL || FRONTEND_URL || "http://localhost:5173"}/auth/login" style="background-color: #3D876C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Log In to Authentix</a>
        </div>
        <p>If you have any questions, please reach out to our support team.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px;">Authentix Verification Systems</p>
      </div>
    `,
  });
};

const sendRejectionNotificationEmail = async (email, name) => {
  const emailFrom = process.env.EMAIL_FROM || "gamilauthentic@gmail.com";
  await sendMailWrapper({
    from: `"Authentix Support" <${emailFrom}>`,
    to: email,
    subject: "Update Regarding Your Authentix Application",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff; color: #1e293b;">
        <h2>Hello, ${name}</h2>
        <p>Thank you for your interest in registering your institution with Authentix.</p>
        <p>After reviewing your registration application, the system administrator has decided to reject the request at this time. This may be due to incomplete verification details or eligibility guidelines.</p>
        <p>If you believe this was an error or wish to provide additional documentation, please contact support.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #94a3b8; font-size: 11px;">Authentix Verification Systems</p>
      </div>
    `,
  });
};

module.exports = {
  verifyTransporter,
  logEmailConfigStatus,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendCertificateIssuedEmail,
  sendAdminApprovalEmail,
  sendApprovalNotificationEmail,
  sendRejectionNotificationEmail,
};
