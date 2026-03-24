import { prisma } from "lib/prisma";

function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createGroupCoupon(
  userId: string,
  groupId: string,
  groupDeadline: Date
): Promise<{ code: string; validTo: Date }> {
  let code = generateCouponCode();
  let attempts = 0;

  while (attempts < 5) {
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (!existing) {
      // If code wasn't generated after 5 tries, this isn't meant to be :(
      if (attempts === 4) throw new Error("Failed to generate unique coupon code");
      break;
    }
    code = generateCouponCode();
    attempts++;
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      groupId,
      userId,
      validTo: groupDeadline,
    },
  });

  return { code: coupon.code, validTo: coupon.validTo };
}
