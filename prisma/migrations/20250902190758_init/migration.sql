/*
  Warnings:

  - You are about to drop the column `images` on the `ActiveGroup` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfParticipants` on the `ActiveGroup` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ActiveGroup` table. All the data in the column will be lost.
  - You are about to drop the column `subTitle` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `RequestGroup` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ActiveGroupParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RequestGroupParticipants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[websiteUrl]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `basePrice` to the `ActiveGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupPrice` to the `ActiveGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."GroupStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "public"."_ActiveGroupParticipants" DROP CONSTRAINT "_ActiveGroupParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ActiveGroupParticipants" DROP CONSTRAINT "_ActiveGroupParticipants_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RequestGroupParticipants" DROP CONSTRAINT "_RequestGroupParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RequestGroupParticipants" DROP CONSTRAINT "_RequestGroupParticipants_B_fkey";

-- DropIndex
DROP INDEX "public"."User_mail_key";

-- AlterTable
ALTER TABLE "public"."ActiveGroup" DROP COLUMN "images",
DROP COLUMN "numberOfParticipants",
DROP COLUMN "price",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "groupPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxParticipants" INTEGER,
ADD COLUMN     "minParticipants" INTEGER,
ADD COLUMN     "status" "public"."GroupStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "subTitle",
DROP COLUMN "url",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "websiteUrl" TEXT,
ALTER COLUMN "logo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."RequestGroup" DROP COLUMN "images",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "public"."GroupStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "image",
DROP COLUMN "mail",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT;

-- DropTable
DROP TABLE "public"."_ActiveGroupParticipants";

-- DropTable
DROP TABLE "public"."_RequestGroupParticipants";

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserImage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "UserImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RequestGroupImage" (
    "id" TEXT NOT NULL,
    "requestGroupId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "RequestGroupImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActiveGroupImage" (
    "id" TEXT NOT NULL,
    "activeGroupId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "ActiveGroupImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RequestGroupParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestGroupId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestGroupParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActiveGroupParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeGroupId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPing" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveGroupParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_userId_imageId_key" ON "public"."UserImage"("userId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "RequestGroupImage_requestGroupId_imageId_key" ON "public"."RequestGroupImage"("requestGroupId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveGroupImage_activeGroupId_imageId_key" ON "public"."ActiveGroupImage"("activeGroupId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "RequestGroupParticipant_userId_requestGroupId_key" ON "public"."RequestGroupParticipant"("userId", "requestGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveGroupParticipant_userId_activeGroupId_key" ON "public"."ActiveGroupParticipant"("userId", "activeGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_websiteUrl_key" ON "public"."Company"("websiteUrl");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."UserImage" ADD CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserImage" ADD CONSTRAINT "UserImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestGroupImage" ADD CONSTRAINT "RequestGroupImage_requestGroupId_fkey" FOREIGN KEY ("requestGroupId") REFERENCES "public"."RequestGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestGroupImage" ADD CONSTRAINT "RequestGroupImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroupImage" ADD CONSTRAINT "ActiveGroupImage_activeGroupId_fkey" FOREIGN KEY ("activeGroupId") REFERENCES "public"."ActiveGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroupImage" ADD CONSTRAINT "ActiveGroupImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestGroup" ADD CONSTRAINT "RequestGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestGroupParticipant" ADD CONSTRAINT "RequestGroupParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestGroupParticipant" ADD CONSTRAINT "RequestGroupParticipant_requestGroupId_fkey" FOREIGN KEY ("requestGroupId") REFERENCES "public"."RequestGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroup" ADD CONSTRAINT "ActiveGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroupParticipant" ADD CONSTRAINT "ActiveGroupParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActiveGroupParticipant" ADD CONSTRAINT "ActiveGroupParticipant_activeGroupId_fkey" FOREIGN KEY ("activeGroupId") REFERENCES "public"."ActiveGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
