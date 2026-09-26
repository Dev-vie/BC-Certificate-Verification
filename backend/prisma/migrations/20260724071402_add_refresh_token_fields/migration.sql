-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "refreshTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "refreshTokenHash" TEXT;
