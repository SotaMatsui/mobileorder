-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_staffId_fkey";

-- DropIndex
DROP INDEX "Order_staffId_idx";
