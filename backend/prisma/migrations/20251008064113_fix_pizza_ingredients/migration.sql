/*
  Warnings:

  - You are about to drop the column `pizzaId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Pizza` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `Pizza` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Ingredient" DROP CONSTRAINT "Ingredient_pizzaId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "pizzaId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Pizza" DROP COLUMN "price",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "PizzaIngredient" (
    "pizzaId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,

    CONSTRAINT "PizzaIngredient_pkey" PRIMARY KEY ("pizzaId","ingredientId")
);

-- AddForeignKey
ALTER TABLE "PizzaIngredient" ADD CONSTRAINT "PizzaIngredient_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "Pizza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzaIngredient" ADD CONSTRAINT "PizzaIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
