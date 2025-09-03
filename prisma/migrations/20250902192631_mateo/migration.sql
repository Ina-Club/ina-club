/*
  Warnings:

  - You are about to drop the column `logo` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[logoId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profilePictureId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."UserImage" DROP CONSTRAINT "UserImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserImage" DROP CONSTRAINT "UserImage_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "logo",
ADD COLUMN     "logoId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "profilePicture",
ADD COLUMN     "profilePictureId" TEXT;

-- DropTable
DROP TABLE "public"."UserImage";

-- CreateIndex
CREATE UNIQUE INDEX "Company_logoId_key" ON "public"."Company"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureId_key" ON "public"."User"("profilePictureId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "public"."Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
