-- CreateEnum
CREATE TYPE "public"."PackageType" AS ENUM ('BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "public"."B2BPackage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageType" "public"."PackageType" NOT NULL,
    "maxGroups" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "B2BPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "b2bPackageId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "B2BPackage_userId_key" ON "public"."B2BPackage"("userId");

-- AddForeignKey
ALTER TABLE "public"."B2BPackage" ADD CONSTRAINT "B2BPackage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_b2bPackageId_fkey" FOREIGN KEY ("b2bPackageId") REFERENCES "public"."B2BPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
