import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkWishItemQuota } from "@/lib/services/quota";
import { DAILY_WISH_ITEM_LIMIT, DAILY_PRICE_ANALYSIS_LIMIT, DAILY_SMART_SEARCH_LIMIT } from "@/app/config/quota";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ isSignedIn: false });
  }

  const now = new Date();
  const activity = await prisma.userActivity.findUnique({
    where: { userId },
  });

  // Check if the user is blocked for wish items (violation block)
  const wishItemViolationBlocked =
    activity?.wishItemBlockedUntil != null &&
    activity.wishItemBlockedUntil > now;

  // Check daily quota for wish items (only if not already violation-blocked)
  let wishItemQuotaReached = false;
  let remainingWishItems = DAILY_WISH_ITEM_LIMIT;
  if (!wishItemViolationBlocked) {
    const quota = await checkWishItemQuota(userId, DAILY_WISH_ITEM_LIMIT);
    wishItemQuotaReached = !quota.allowed;
    remainingWishItems = quota.remaining;
  }

  // Check daily price analysis usage
  let priceAnalysisQuotaReached = false;
  let remainingPriceAnalysis = DAILY_PRICE_ANALYSIS_LIMIT;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // If last analysis was today, use the count. If earlier or null, count is effectively 0.
  let currentCount = 0;
  if (activity?.lastPriceAnalysisDate && activity.lastPriceAnalysisDate >= startOfToday) {
    currentCount = activity.priceAnalysisCount || 0;
  }

  if (currentCount >= DAILY_PRICE_ANALYSIS_LIMIT) {
    priceAnalysisQuotaReached = true;
    remainingPriceAnalysis = 0;
  } else {
    remainingPriceAnalysis = DAILY_PRICE_ANALYSIS_LIMIT - currentCount;
  }


  // Check daily smart search usage
  let smartSearchQuotaReached = false;
  let remainingSmartSearch = DAILY_SMART_SEARCH_LIMIT;

  const startOfTodayForSmartSearch = new Date();
  startOfTodayForSmartSearch.setHours(0, 0, 0, 0);

  let currentSmartCount = 0;
  if (activity?.lastSmartSearchDate && activity.lastSmartSearchDate >= startOfTodayForSmartSearch) {
    currentSmartCount = activity.smartSearchCount || 0;
  }

  if (currentSmartCount >= DAILY_SMART_SEARCH_LIMIT) {
    smartSearchQuotaReached = true;
    remainingSmartSearch = 0;
  } else {
    remainingSmartSearch = DAILY_SMART_SEARCH_LIMIT - currentSmartCount;
  }

  return NextResponse.json({
    isSignedIn: true,
    canSubmitWishItem: !wishItemViolationBlocked && !wishItemQuotaReached,
    canAnalyzePrice: !priceAnalysisQuotaReached,
    canUseSmartSearch: !smartSearchQuotaReached,
    wishItemViolationBlocked,
    wishItemQuotaReached,
    priceAnalysisQuotaReached,
    smartSearchQuotaReached,
    remainingWishItems,
    remainingPriceAnalysis,
    remainingSmartSearch,
  });
}
