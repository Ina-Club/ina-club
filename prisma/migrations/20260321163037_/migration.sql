/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."TokenStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'RELEASED');

-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ActiveGroup" DROP CONSTRAINT "ActiveGroup_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."ActiveGroupParticipant" DROP CONSTRAINT "ActiveGroupParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."B2BPackage" DROP CONSTRAINT "B2BPackage_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WishItem" DROP CONSTRAINT "WishItem_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "ownerId" TEXT;

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."PendingProfile";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- CreateTable
CREATE TABLE "public"."PaymentServiceProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PaymentServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeGroupId" TEXT NOT NULL,
    "pspId" TEXT NOT NULL,
    "pspToken" TEXT NOT NULL,
    "agreedFee" DOUBLE PRECISION NOT NULL,
    "status" "public"."TokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentServiceProvider_name_key" ON "public"."PaymentServiceProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentToken_userId_activeGroupId_key" ON "public"."PaymentToken"("userId", "activeGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_ownerId_key" ON "public"."Company"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."PaymentToken" ADD CONSTRAINT "PaymentToken_activeGroupId_fkey" FOREIGN KEY ("activeGroupId") REFERENCES "public"."ActiveGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentToken" ADD CONSTRAINT "PaymentToken_pspId_fkey" FOREIGN KEY ("pspId") REFERENCES "public"."PaymentServiceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
