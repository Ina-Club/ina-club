/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `B2BPackage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "B2BPackage" ADD COLUMN     "email" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "B2BPackage_email_key" ON "B2BPackage"("email");
