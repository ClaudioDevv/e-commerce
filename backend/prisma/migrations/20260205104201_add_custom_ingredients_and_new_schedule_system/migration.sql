/*
  Warnings:

  - The values [PREPARING] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `breakEnd` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `breakStart` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `closeTime` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `openTime` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the `CartItemIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItemIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PizzaBaseIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PizzaConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomizableCategory" AS ENUM ('QUESO', 'CARNE', 'VEGETAL', 'SALSA', 'EXTRA');

-- CreateEnum
CREATE TYPE "CustomizationAction" AS ENUM ('ADD', 'REMOVE');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'BURGER';
ALTER TYPE "Category" ADD VALUE 'ENSALADA';

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAID', 'CONFIRMED', 'READY', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "CartItemIngredient" DROP CONSTRAINT "CartItemIngredient_cartItemId_fkey";

-- DropForeignKey
ALTER TABLE "CartItemIngredient" DROP CONSTRAINT "CartItemIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemIngredient" DROP CONSTRAINT "OrderItemIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItemIngredient" DROP CONSTRAINT "OrderItemIngredient_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "PizzaBaseIngredient" DROP CONSTRAINT "PizzaBaseIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "PizzaBaseIngredient" DROP CONSTRAINT "PizzaBaseIngredient_pizzaConfigId_fkey";

-- DropForeignKey
ALTER TABLE "PizzaConfig" DROP CONSTRAINT "PizzaConfig_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "allowCustomization" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subcategory" TEXT;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "breakEnd",
DROP COLUMN "breakStart",
DROP COLUMN "closeTime",
DROP COLUMN "openTime";

-- DropTable
DROP TABLE "CartItemIngredient";

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "OrderItemIngredient";

-- DropTable
DROP TABLE "PizzaBaseIngredient";

-- DropTable
DROP TABLE "PizzaConfig";

-- DropEnum
DROP TYPE "IngredientAction";

-- DropEnum
DROP TYPE "IngredientCategory";

-- CreateTable
CREATE TABLE "Customizable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "extraPrice" DECIMAL(10,2) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "category" "CustomizableCategory",
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customizable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBaseCustomizable" (
    "productId" TEXT NOT NULL,
    "customizableId" INTEGER NOT NULL,
    "isRemovable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductBaseCustomizable_pkey" PRIMARY KEY ("productId","customizableId")
);

-- CreateTable
CREATE TABLE "ProductAvailableCustomizable" (
    "productId" TEXT NOT NULL,
    "customizableId" INTEGER NOT NULL,

    CONSTRAINT "ProductAvailableCustomizable_pkey" PRIMARY KEY ("productId","customizableId")
);

-- CreateTable
CREATE TABLE "CartItemCustomization" (
    "cartItemId" TEXT NOT NULL,
    "customizableId" INTEGER NOT NULL,
    "action" "CustomizationAction" NOT NULL,

    CONSTRAINT "CartItemCustomization_pkey" PRIMARY KEY ("cartItemId","customizableId","action")
);

-- CreateTable
CREATE TABLE "OrderItemCustomization" (
    "orderItemId" TEXT NOT NULL,
    "customizableId" INTEGER NOT NULL,
    "action" "CustomizationAction" NOT NULL,
    "nameSnapshot" TEXT NOT NULL,
    "priceSnapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItemCustomization_pkey" PRIMARY KEY ("orderItemId","customizableId","action")
);

-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialHours" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "openTime" TEXT,
    "closeTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customizable_name_key" ON "Customizable"("name");

-- CreateIndex
CREATE INDEX "Customizable_available_idx" ON "Customizable"("available");

-- CreateIndex
CREATE INDEX "Customizable_category_idx" ON "Customizable"("category");

-- CreateIndex
CREATE INDEX "ProductBaseCustomizable_productId_idx" ON "ProductBaseCustomizable"("productId");

-- CreateIndex
CREATE INDEX "ProductAvailableCustomizable_productId_idx" ON "ProductAvailableCustomizable"("productId");

-- CreateIndex
CREATE INDEX "CartItemCustomization_cartItemId_idx" ON "CartItemCustomization"("cartItemId");

-- CreateIndex
CREATE INDEX "OrderItemCustomization_orderItemId_idx" ON "OrderItemCustomization"("orderItemId");

-- CreateIndex
CREATE INDEX "BusinessHours_dayOfWeek_idx" ON "BusinessHours"("dayOfWeek");

-- CreateIndex
CREATE INDEX "BusinessHours_isClosed_idx" ON "BusinessHours"("isClosed");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHours_dayOfWeek_order_key" ON "BusinessHours"("dayOfWeek", "order");

-- CreateIndex
CREATE INDEX "SpecialHours_date_idx" ON "SpecialHours"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialHours_date_key" ON "SpecialHours"("date");

-- AddForeignKey
ALTER TABLE "ProductBaseCustomizable" ADD CONSTRAINT "ProductBaseCustomizable_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBaseCustomizable" ADD CONSTRAINT "ProductBaseCustomizable_customizableId_fkey" FOREIGN KEY ("customizableId") REFERENCES "Customizable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAvailableCustomizable" ADD CONSTRAINT "ProductAvailableCustomizable_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAvailableCustomizable" ADD CONSTRAINT "ProductAvailableCustomizable_customizableId_fkey" FOREIGN KEY ("customizableId") REFERENCES "Customizable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemCustomization" ADD CONSTRAINT "CartItemCustomization_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemCustomization" ADD CONSTRAINT "CartItemCustomization_customizableId_fkey" FOREIGN KEY ("customizableId") REFERENCES "Customizable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemCustomization" ADD CONSTRAINT "OrderItemCustomization_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemCustomization" ADD CONSTRAINT "OrderItemCustomization_customizableId_fkey" FOREIGN KEY ("customizableId") REFERENCES "Customizable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
