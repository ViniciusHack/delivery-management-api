-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shipper_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "shipper_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipper_id_fkey" FOREIGN KEY ("shipper_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
