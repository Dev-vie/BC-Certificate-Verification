import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VeriCert Database for Competition...");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("VeriCert2026!", salt);

  const institution = await prisma.institution.upsert({
    where: { email: "demo@vericert.edu" },
    update: {
      name: "VeriCert Institute of Technology",
      password: hashedPassword,
      isVerified: true,
    },
    create: {
      name: "VeriCert Institute of Technology",
      email: "demo@vericert.edu",
      password: hashedPassword,
      isVerified: true,
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=VeriCert",
    },
  });

  console.log(`✅ Demo Institution created: ${institution.email} (Password: VeriCert2026!)`);

  const template = await prisma.template.create({
    data: {
      title: "Blockchain Excellence Award",
      filePath: "/uploads/templates/sample-cert-template.pdf",
      placeholders: JSON.stringify([
        { id: "recipientName", x: 400, y: 240, width: 600, height: 40, align: "center", fontSize: 26, fontFamily: "Times-Bold", color: "#0F172A" },
        { id: "course", x: 400, y: 310, width: 600, height: 35, align: "center", fontSize: 18, fontFamily: "Helvetica", color: "#334155" },
        { id: "issueDate", x: 260, y: 440, width: 200, height: 30, align: "center", fontSize: 14, fontFamily: "Helvetica", color: "#64748B" },
        { id: "qrCode", x: 620, y: 400, width: 80, height: 80, align: "center" }
      ]),
      institutionId: institution.id,
    },
  });

  console.log(`✅ Demo Template created: ${template.title}`);

  const sampleCert = await prisma.certificate.create({
    data: {
      certificateId: "VC-2026-DEMO-0001",
      recipientName: "Alex Rivera",
      recipientId: "STU-88921",
      recipientEmail: "alex.rivera@example.com",
      course: "Advanced Blockchain Architecture & Smart Contract Security",
      grade: "Distinction (98%)",
      issueDate: new Date(),
      status: "issued",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      txHash: "0x3f5c71b689a946e3d23f2b45e7587efc37cf3a9033320f7961b7ee9c4456942c",
      blockNumber: 12948201,
      contractAddress: "0x1234567890123456789012345678901234567890",
      institutionId: institution.id,
      templateId: template.id,
    },
  });

  console.log(`✅ Demo Certificate created: ${sampleCert.certificateId}`);
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
