-- DropForeignKey
ALTER TABLE "public"."ActiveGroup" DROP CONSTRAINT "ActiveGroup_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RequestGroup" DROP CONSTRAINT "RequestGroup_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "public"."RequestGroup" ADD CONSTRAINT "RequestGroup_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroup" ADD CONSTRAINT "ActiveGroup_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
