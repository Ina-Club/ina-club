/*
  Warnings:

  - You are about to drop the column `company` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyName` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Testimonial" DROP COLUMN "company",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Partner";

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
