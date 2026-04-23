import { LikeTargetType, Prisma } from "@prisma/client";
import type { WishItemData } from "@/components/demand-pulse/WishItemCard";
import { getClerkPublicUsersMap } from "@/lib/clerk-users";
import { prisma } from "@/lib/prisma";

type FetchWishItemCardsOptions = {
  where?: Prisma.WishItemWhereInput;
  orderBy?:
    | Prisma.WishItemOrderByWithRelationInput
    | Prisma.WishItemOrderByWithRelationInput[];
  take?: number;
  currentUserId?: string | null;
};

export async function fetchWishItemCards({
  where,
  orderBy = { createdAt: "desc" },
  take,
  currentUserId,
}: FetchWishItemCardsOptions = {}): Promise<WishItemData[]> {
  const items = await prisma.wishItem.findMany({
    where,
    orderBy,
    take,
    select: {
      id: true,
      text: true,
      targetPrice: true,
      createdAt: true,
      createdById: true,
      category: { select: { name: true } },
    },
  });

  if (!items.length) {
    return [];
  }

  const itemIds = items.map((item) => item.id);

  const [likeCounts, userLikes, authorsMap] = await Promise.all([
    prisma.like.groupBy({
      by: ["targetId"],
      where: {
        targetType: LikeTargetType.WISH_ITEM,
        targetId: { in: itemIds },
      },
      _count: { id: true },
    }),
    currentUserId
      ? prisma.like.findMany({
          where: {
            userId: currentUserId,
            targetType: LikeTargetType.WISH_ITEM,
            targetId: { in: itemIds },
          },
          select: { targetId: true },
        })
      : Promise.resolve<Array<{ targetId: string }>>([]),
    getClerkPublicUsersMap(items.map((item) => item.createdById)),
  ]);

  const likeCountMap = new Map(
    likeCounts.map((like) => [like.targetId, like._count.id]),
  );
  const userLikedSet = new Set(userLikes.map((like) => like.targetId));

  return items.map((item) => ({
    id: item.id,
    text: item.text,
    targetPrice: item.targetPrice,
    categoryName: item.category?.name,
    createdAt: item.createdAt.toISOString(),
    authorName: authorsMap.get(item.createdById)?.name ?? "משתמש",
    authorAvatar: authorsMap.get(item.createdById)?.imageUrl ?? null,
    likeCount: likeCountMap.get(item.id) ?? 0,
    isLikedByMe: userLikedSet.has(item.id),
  }));
}
