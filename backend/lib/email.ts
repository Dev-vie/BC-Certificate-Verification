export async function sendVerificationEmail(
  toEmail: string,
  institutionName: string,
  code: string
): Promise<void> {
  console.log(`\n======================================================`);
  console.log(`✉️ [VeriCert Email Notification]`);
  console.log(`To: ${toEmail} (${institutionName})`);
  console.log(`Subject: Verify your VeriCert Institution Account`);
  console.log(`Verification Code: [ ${code} ]`);
  console.log(`======================================================\n`);
}

export async function sendResetCodeEmail(
  toEmail: string,
  code: string
): Promise<void> {
  console.log(`\n======================================================`);
  console.log(`✉️ [VeriCert Email Notification]`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: Reset your VeriCert Password`);
  console.log(`Password Reset Code: [ ${code} ]`);
  console.log(`======================================================\n`);
}

export async function sendCertificateIssuedEmail(
  recipientEmail: string,
  recipientName: string,
  certData: any
): Promise<void> {
  console.log(`\n======================================================`);
  console.log(`🎓 [VeriCert Certificate Notification]`);
  console.log(`To: ${recipientEmail} (${recipientName})`);
  console.log(`Certificate ID: ${certData.certificateId}`);
  console.log(`Verification Link: ${certData.qrCode || "Available on portal"}`);
  console.log(`======================================================\n`);
}
