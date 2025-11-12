import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { GroupStatus } from "lib/types/status";

// GET /api/active-groups
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const titleParam = searchParams.get('title');
    const statusParam = searchParams.get('status');
    const lastWeekParam = searchParams.get('lastWeek');
    const where: any = {};
    if (titleParam) {
      const exists = await prisma.activeGroup.findFirst({
        where: { title: { equals: titleParam, mode: "insensitive" } },
        select: { id: true },
      });
      return NextResponse.json({ exists: !!exists });
    }
    if (statusParam) {
      const status: GroupStatus = GroupStatus[statusParam.toUpperCase() as keyof typeof GroupStatus]
      if (!status) {
        return NextResponse.json({ error: "Incorrect status provided!" }, { status: 400 });
      }
      where.status = status;
    }
    if (lastWeekParam === 'true') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      where.createdAt = {
        gte: oneWeekAgo
      };
    }

    // Get all active groups
    const rows = await prisma.activeGroup.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        category: { select: { name: true } },
        basePrice: true,
        groupPrice: true,
        deadline: true,
        participants: { //TODO: Fetch length instead
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: { select: { url: true } },
              },
            },
          },
        },
        minParticipants: true,
        maxParticipants: true,
        images: {
          select: { image: { select: { url: true } }, order: true },
          orderBy: { order: "asc" },
        },
      },
      where,
      orderBy: { createdAt: "desc" },
    });

    const data = rows.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      category: r.category?.name ?? "",
      basePrice: r.basePrice,
      groupPrice: r.groupPrice,
      deadline: r.deadline,
      images: r.images.length ? r.images.map((ri) => ri.image.url) : ["/InaClubLogo.png"],
      participants: r.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name ?? "",
        image: p.user.profilePicture?.url ?? "",
        mail: p.user.email,
      })),
      minParticipants: r.minParticipants,
      maxParticipants: r.maxParticipants
    }));

    return NextResponse.json({ activeGroups: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בשליפת קבוצות פעילות" }, { status: 500 });
  }
}

// POST /api/active-groups
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, categoryId, basePrice, groupPrice, deadline, imageUrls, minParticipants, maxParticipants } = body as {
      title: string;
      description: string;
      categoryId: string;
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
        basePrice,
        groupPrice,
        deadline: new Date(deadline),
        status: GroupStatus.OPEN,
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
