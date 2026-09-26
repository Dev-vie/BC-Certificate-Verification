const prisma = require("../../prisma/prismaClient");

const VALID_STATUSES = ["issued", "verified"];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const getDashboard = async (institutionId) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thirtyDaysAgo = addDays(todayStart, -30);

  const [
    totalIssued,
    issuedThisMonth,
    issuedLastMonth,
    verifiedToday,
    verifiedYesterday,
    recipientRows,
    programRows,
    totalLast30Days,
    verifiedLast30Days,
  ] = await Promise.all([
    prisma.certificate.count({ where: { institutionId } }),

    prisma.certificate.count({
      where: { institutionId, createdAt: { gte: thisMonthStart } },
    }),

    prisma.certificate.count({
      where: {
        institutionId,
        createdAt: { gte: lastMonthStart, lt: thisMonthStart },
      },
    }),

    prisma.certificate.count({
      where: {
        institutionId,
        status: { in: VALID_STATUSES, mode: "insensitive" },
        updatedAt: { gte: todayStart, lt: tomorrowStart },
      },
    }),

    prisma.certificate.count({
      where: {
        institutionId,
        status: { in: VALID_STATUSES, mode: "insensitive" },
        updatedAt: { gte: yesterdayStart, lt: todayStart },
      },
    }),

    prisma.certificate.findMany({
      where: { institutionId },
      distinct: ["recipientEmail"],
      select: { recipientEmail: true },
    }),

    prisma.certificate.findMany({
      where: { institutionId },
      distinct: ["course"],
      select: { course: true },
    }),

    prisma.certificate.count({
      where: { institutionId, createdAt: { gte: thirtyDaysAgo } },
    }),

    prisma.certificate.count({
      where: {
        institutionId,
        status: { in: VALID_STATUSES, mode: "insensitive" },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  const totalIssuedChangePercent =
    issuedLastMonth > 0
      ? Math.round(
          ((issuedThisMonth - issuedLastMonth) / issuedLastMonth) * 100,
        )
      : issuedThisMonth > 0
      ? 100
      : 0;

  const verificationRate =
    totalLast30Days > 0
      ? Math.round((verifiedLast30Days / totalLast30Days) * 1000) / 10
      : 0;

  return {
    totalIssued,
    totalIssuedChangePercent,
    verifiedToday,
    verifiedTodayChangeCount: verifiedToday - verifiedYesterday,
    activeRecipients: recipientRows.length,
    activeProgramsCount: programRows.length,
    verificationRate,
  };
};

module.exports = { getDashboard };
