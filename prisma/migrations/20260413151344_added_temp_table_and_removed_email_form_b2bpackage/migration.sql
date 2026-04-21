/*
  Warnings:

  - You are about to drop the column `email` on the `B2BPackage` table. All the data in the column will be lost.
  - Made the column `userId` on table `B2BPackage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerId` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "B2BPackage_email_key";

-- AlterTable
ALTER TABLE "B2BPackage" DROP COLUMN "email",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateTable
CREATE TABLE "B2BInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "maxGroups" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "endDate" TIMESTAMP(3),
    "companyTitle" TEXT NOT NULL,
    "companyAddress" TEXT,
    "companyCity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "B2BInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "B2BInvitation_email_key" ON "B2BInvitation"("email");
