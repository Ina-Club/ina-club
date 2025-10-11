import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { GroupStatus } from "lib/types/status";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    if (title) {
      const exists = await prisma.requestGroup.findFirst({ where: { title: { equals: title, mode: 'insensitive' } }, select: { id: true } });
      return NextResponse.json({ exists: !!exists });
    }

    const rows = await prisma.requestGroup.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        category: { select: { name: true } },
        participants: {
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
        images: {
          select: { image: { select: { url: true } }, order: true },
          orderBy: { order: "asc" },
        },
        activeGroups: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = rows.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      category: r.category?.name ?? "",
      images: r.images.length ? r.images.map((ri) => ri.image.url) : ["/InaClubLogo.png"],
      participants: r.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name ?? "",
        image: p.user.profilePicture?.url ?? "",
        mail: p.user.email,
      })),
      openedGroups: r.activeGroups.map((ag) => ({ id: ag.id })),
    }));

    return NextResponse.json({ requestGroups: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בשליפת בקשות" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, categoryId, imageUrls } = body as {
      title: string; description?: string; categoryId?: string; imageUrls?: string[];
    };
    if (!title) return NextResponse.json({ error: "כותרת חובה" }, { status: 400 });

    // duplicate title check (case-insensitive)
    const exists = await prisma.requestGroup.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
      select: { id: true },
    });
    if (exists) return NextResponse.json({ error: "כותרת כבר קיימת" }, { status: 409 });

    const created = await prisma.requestGroup.create({
      data: {
        title,
        description,
        categoryId: categoryId,
        status: GroupStatus.PENDING,
      },
    });

    if (imageUrls?.length) {
      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const img = await prisma.image.create({ data: { url } });
        await prisma.requestGroupImage.create({ data: { requestGroupId: created.id, imageId: img.id, order: i } });
      }
    }

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה ביצירת בקשה" }, { status: 500 });
  }
}


