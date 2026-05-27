import { prisma } from "@/lib/prisma";

export async function checkWishItemQuota(userId: string, dailyLimit: number): Promise<{ allowed: boolean; remaining: number }> {
  // Check how many wish items the user created in the past 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const count = await prisma.wishItem.count({
    where: { 
      createdById: userId, 
      createdAt: { gte: twentyFourHoursAgo } 
    },
  });

  return { 
    allowed: count < dailyLimit, 
    remaining: Math.max(0, dailyLimit - count) 
  };
}

export async function checkReportQuota(userId: string, dailyLimit: number): Promise<{ allowed: boolean; remaining: number }> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const count = await prisma.report.count({
    where: {
      reporterId: userId,
      createdAt: { gte: twentyFourHoursAgo },
    },
  });

  return {
    allowed: count < dailyLimit,
    remaining: Math.max(0, dailyLimit - count),
  };
}
