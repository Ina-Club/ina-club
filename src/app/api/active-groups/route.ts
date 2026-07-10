import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { GroupStatus } from "@prisma/client";
import { validateSession } from "@/lib/auth";
import { DEFAULT_PAGINATION, MAX_PAGINATION_LIMIT } from "@/app/config/pagination";
import { fetchActiveGroups } from "@/lib/groups";

// GET /api/active-groups
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const titleParam = searchParams.get('title');
    const statusesParams = searchParams.getAll('status');
    const lastWeekParam = searchParams.get('lastWeek');
    const searchParam = searchParams.get("search");
    const categoryParams = searchParams.getAll("category").filter(Boolean);
    const companyParams = searchParams.getAll("company").filter(Boolean);
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const participantRangeParam = searchParams.get("participantRange");
    const orderByParam = searchParams.get("orderBy");

    const cursor = searchParams.get("cursor") || undefined;
    const rawLimit: number = Number(searchParams.get('limit')) || DEFAULT_PAGINATION;
    const limit: number = Math.min(rawLimit, MAX_PAGINATION_LIMIT);

    // Determine sort order — default createdAt desc, or by participant count
    let orderBy: any = { createdAt: "desc" };
    if (orderByParam === "participants") {
      orderBy = { participants: { _count: "desc" } };
    }

    const filters: any[] = [];
    if (titleParam) {
      const exists = await prisma.activeGroup.findFirst({
        where: { title: { equals: titleParam, mode: "insensitive" } },
        select: { id: true },
      });
      return NextResponse.json({ exists: !!exists });
    }
    if (statusesParams.length > 0) {
      const statuses: GroupStatus[] = statusesParams
        .map(s => GroupStatus[s.toUpperCase() as keyof typeof GroupStatus])
        .filter(Boolean);
      if (statuses.length === 0) {
        return NextResponse.json({ error: "Incorrect status provided!" }, { status: 400 });
      }
      filters.push({ status: { in: statuses } });
    }
    if (lastWeekParam === 'true') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filters.push({
        createdAt: {
          gte: oneWeekAgo
        }
      });
    }
    if (categoryParams.length > 0) {
      filters.push({
        category: { name: { in: categoryParams } },
      });
    }
    if (companyParams.length > 0) {
      filters.push({
        company: { title: { in: companyParams } },
      });
    }
    if (searchParam?.trim()) {
      const searchText = searchParam.trim();
      filters.push({
        OR: [
          { title: { contains: searchText, mode: "insensitive" } },
          { description: { contains: searchText, mode: "insensitive" } },
          { category: { name: { contains: searchText, mode: "insensitive" } } },
          // TODO: Add price search filtering (prisma don't support native numeric.contains method)
        ],
      });
    }
    const minPrice = minPriceParam !== null ? Number(minPriceParam) : undefined;
    const maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : undefined;
    const hasMinPrice = minPriceParam !== null && !Number.isNaN(minPrice);
    const hasMaxPrice = maxPriceParam !== null && !Number.isNaN(maxPrice);
    if (hasMinPrice || hasMaxPrice) {
      filters.push({
        groupPrice: {
          ...(hasMinPrice ? { gte: minPrice } : {}),
          ...(hasMaxPrice ? { lte: maxPrice } : {}),
        },
      });
    }

    if (participantRangeParam) {
      if (participantRangeParam === "0") {
        filters.push({
          participants: {
            _count: {
              equals: 0
            }
          }
        });
      } else if (participantRangeParam === "1-5") {
        filters.push({
          participants: {
            _count: {
              gte: 1,
              lte: 5
            }
          }
        });
      } else if (participantRangeParam === "6-15") {
        filters.push({
          participants: {
            _count: {
              gte: 6,
              lte: 15
            }
          }
        });
      } else if (participantRangeParam === "16+") {
        filters.push({
          participants: {
            _count: {
              gte: 16
            }
          }
        });
      }
    }

    const where = filters.length ? { AND: filters } : {};

    const activeGroups = await fetchActiveGroups({
      whereData: where,
      take: limit + 1,
      orderBy,
      cursor: cursor ? { id: cursor } : undefined,
    });

    let nextCursor: string | null = null;

    if (activeGroups.length > limit) {
      const nextItem = activeGroups.pop()!; // remove the extra one
      nextCursor = nextItem.id;
    }

    return NextResponse.json({ activeGroups, nextCursor });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בשליפת קבוצות פעילות" }, { status: 500 });
  }
}

// POST /api/active-groups
export async function POST(req: Request) {
  try {
    const { userId, response } = await validateSession();
    if (response) return response;

    const body = await req.json();
    const { title, description, categoryId, companyId, basePrice, groupPrice, deadline, imageUrls, minParticipants, maxParticipants } = body as {
      title: string;
      description: string;
      categoryId: string;
      companyId: string;
      basePrice: number;
      groupPrice: number;
      deadline: string;
      imageUrls: string[];
      minParticipants?: number;
      maxParticipants?: number;
    };

    if (!title) return NextResponse.json({ error: "כותרת חובה" }, { status: 400 });
    if (!description) return NextResponse.json({ error: "תיאור חובה" }, { status: 400 });
    if (!categoryId) return NextResponse.json({ error: "קטגוריה חובה" }, { status: 400 });
    if (!companyId) return NextResponse.json({ error: "חברה חובה" }, { status: 400 });
    if (!basePrice) return NextResponse.json({ error: "מחיר בסיסי חובה" }, { status: 400 });
    if (!groupPrice) return NextResponse.json({ error: "מחיר קבוצה חובה" }, { status: 400 });
    if (!deadline) return NextResponse.json({ error: "תאריך יעד חובה" }, { status: 400 });
    if (!imageUrls?.length) return NextResponse.json({ error: "חובה תמונה אחת לפחות" }, { status: 400 });

    // duplicate title check
    const exists = await prisma.activeGroup.findFirst({
      where: { title: { equals: title, mode: "insensitive" } },
      select: { id: true },
    });
    if (exists) return NextResponse.json({ error: "כותרת כבר קיימת" }, { status: 409 });

    const created = await prisma.activeGroup.create({
      data: {
        title,
        description,
        categoryId,
        companyId,
        basePrice,
        groupPrice,
        deadline: new Date(deadline),
        status: GroupStatus.OPEN,
        createdById: userId!,
        minParticipants,
        maxParticipants
      },
    });

    const promises = imageUrls.map(async (url, i) => {
      const img = await prisma.image.create({ data: { url } });
      await prisma.activeGroupImage.create({ data: { activeGroupId: created.id, imageId: img.id, order: i } });
    });
    await Promise.all(promises);

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה ביצירת קבוצה פעילה" }, { status: 500 });
  }
}
