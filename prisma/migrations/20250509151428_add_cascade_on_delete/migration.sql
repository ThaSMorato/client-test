-- DropForeignKey
ALTER TABLE "favorite_products" DROP CONSTRAINT "favorite_products_user_id_fkey";

-- AddForeignKey
ALTER TABLE "favorite_products" ADD CONSTRAINT "favorite_products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
