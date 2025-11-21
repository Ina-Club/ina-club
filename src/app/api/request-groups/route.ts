import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { GroupStatus } from "lib/types/status";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { validateSession } from "@/lib/auth";
import { getUserIdBySession } from "@/lib/user";

export async function GET(req: Request) {
  try {
    // This represents GET by url params.
    const { searchParams } = new URL(req.url);
    const titleParam = searchParams.get("title");
    const statusParam = searchParams.get("status");
    const lastWeekParam = searchParams.get("lastWeek");
    const where: any = {};
    if (titleParam) {
      const exists = await prisma.requestGroup.findFirst({
        where: { title: { equals: titleParam, mode: "insensitive" } },
        select: { id: true },
      });
      return NextResponse.json({ exists: !!exists });
    }
    if (statusParam) {
      const status: GroupStatus =
        GroupStatus[statusParam.toUpperCase() as keyof typeof GroupStatus];
      if (!status) {
        return NextResponse.json(
          { error: "Incorrect status provided!" },
          { status: 400 }
        );
      }
      where.status = status;
    }
    if (lastWeekParam === "true") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      where.createdAt = {
        gte: oneWeekAgo,
      };
    }

    // This represents GET all request groups.
    const rows = await prisma.requestGroup.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        category: { select: { name: true } },
        participants: {
          //TODO: Fetch length instead
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
      where,
      orderBy: { createdAt: "desc" },
    });

    const data = rows.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      category: r.category?.name ?? "",
      images: r.images.length
        ? r.images.map((ri) => ri.image.url)
        : ["/InaClubLogo.png"],
      participants: r.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name ?? "",
        image: p.user.profilePicture?.url ?? "",
        mail: p.user.email,
      })),
      // TODO: Remove
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
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    // }

    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email },
    //   select: { id: true },
    // });

    // if (!user) {
    //   return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    // }

    const { session, response } = await validateSession();
    if (response) return response;

    const body = await req.json();
    const { title, description, categoryId, imageUrls } = body as {
      title: string;
      description: string;
      categoryId: string;
      imageUrls: string[];
    };
    if (!title)
      return NextResponse.json({ error: "כותרת חובה" }, { status: 400 });
    if (!description)
      return NextResponse.json({ error: "תיאור חובה" }, { status: 400 });
    if (!categoryId)
      return NextResponse.json({ error: "קטגוריה חובה" }, { status: 400 });
    if (!imageUrls)
      return NextResponse.json(
        { error: "חובה תמונה אחת לפחות" },
        { status: 400 }
      );
    // duplicate title check (case-insensitive)
    const exists = await prisma.requestGroup.findFirst({
      where: { title: { equals: title, mode: "insensitive" } },
      select: { id: true },
    });
    if (exists)
      return NextResponse.json({ error: "כותרת כבר קיימת" }, { status: 409 });

    const created = await prisma.requestGroup.create({
      data: {
        title,
        description,
        categoryId: categoryId,
        status: GroupStatus.PENDING,
        // createdById: user.id,
        // participants: {
        //   create: {
        //     userId: user.id,
        //   },
        // },
        createdById: await getUserIdBySession(session),
        participants: {
          create: {
            userId: await getUserIdBySession(session),
          },
        },
      },
    });

    const promises = imageUrls.map(async (url, i) => {
      const img = await prisma.image.create({ data: { url } });
      await prisma.requestGroupImage.create({
        data: { requestGroupId: created.id, imageId: img.id, order: i },
      });
    });
    await Promise.all(promises);

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה ביצירת בקשה" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { response } = await validateSession();
    if (response) return response;

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam)
      return NextResponse.json(
        { error: "No group was specified!" },
        { status: 400 }
      );

    const exists = await prisma.requestGroup.findFirst({
      where: { id: { equals: idParam, mode: "insensitive" } },
      select: { id: true },
    });
    if (!exists)
      return NextResponse.json(
        { error: "The specified group doesn't exist!" },
        { status: 400 }
      );

    const body = await req.json();
    const { status } = body;
    const dataToUpdate: any = {};
    if (status) {
      if (
        typeof status !== "string" ||
        !((status.toUpperCase() as keyof typeof GroupStatus) in GroupStatus)
      ) {
        return NextResponse.json(
          { error: "Invalid status value!" },
          { status: 400 }
        );
      }
      dataToUpdate.status = status;
    }

    const updated = await prisma.requestGroup.update({
      where: { id: idParam },
      data: dataToUpdate,
    });
    return NextResponse.json({ id: updated.id }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בעדכון בקשה!" }, { status: 500 });
  }
}
