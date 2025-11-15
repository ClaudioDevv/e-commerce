/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerEmail";

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "breakStart" TEXT,
    "breakEnd" TEXT,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "minOrderAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "avgPrepMinutes" INTEGER NOT NULL DEFAULT 20,
    "autoAcceptOrders" BOOLEAN NOT NULL DEFAULT true,
    "temporarilyClosed" BOOLEAN NOT NULL DEFAULT false,
    "statusMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
