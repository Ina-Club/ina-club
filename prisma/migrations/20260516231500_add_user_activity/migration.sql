-- CreateTable
CREATE TABLE "UserActivity" (
    "userId" TEXT NOT NULL,
    "lastWishItemDate" TIMESTAMP(3),
    "lastPriceAnalysisDate" TIMESTAMP(3),
    "wishItemBlockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priceAnalysisCount" INTEGER NOT NULL DEFAULT 0,
    "lastSmartSearchDate" TIMESTAMP(3),
    "smartSearchCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("userId")
);
