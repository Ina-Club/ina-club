/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_companyId_key" ON "public"."User"("companyId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
