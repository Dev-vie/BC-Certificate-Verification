/*
  Warnings:

  - You are about to drop the column `verifyToken` on the `Institution` table. All the data in the column will be lost.
  - You are about to drop the column `verifyTokenExpiry` on the `Institution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "verifyToken",
DROP COLUMN "verifyTokenExpiry",
ADD COLUMN     "verifyCode" TEXT,
ADD COLUMN     "verifyCodeExpiry" TIMESTAMP(3);
