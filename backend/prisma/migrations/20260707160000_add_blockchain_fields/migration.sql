-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN "hash" TEXT,
ADD COLUMN "txHash" TEXT,
ADD COLUMN "blockNumber" INTEGER,
ADD COLUMN "contractAddress" TEXT;
