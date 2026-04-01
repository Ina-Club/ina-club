-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'USED');

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_userId_idx" ON "Coupon"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_userId_groupId_key" ON "Coupon"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ActiveGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
