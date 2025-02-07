/*
  Warnings:

  - You are about to alter the column `quantity` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;
