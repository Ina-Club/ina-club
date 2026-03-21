import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { validateSession, getClerkUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");
    const summaryOnly = view === "summary";

    const { userId, response } = await validateSession();
    if (response) return response;

    const clerkUser = await getClerkUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "משתמש לא נמצא ב-Clerk" }, { status: 404 });
    }

    const userData = {
      id: clerkUser.id,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || clerkUser.username || "משתמש",
      email: clerkUser.emailAddresses[0]?.emailAddress,
      profilePicture: clerkUser.imageUrl,
      createdAt: new Date(clerkUser.createdAt).toISOString(),
    };

    if (summaryOnly) {
      return NextResponse.json(userData);
    }

    // Fetch app-specific data from DB using clerk userId
    const memberships = await prisma.activeGroupParticipant.findMany({
      where: { userId },
      include: {
        activeGroup: {
          include: {
            category: true,
            company: true,
            images: {
              include: { image: true },
              orderBy: { order: 'asc' }
            },
            participants: true // Only IDs now
          }
        }
      }
    });

    const wishItems = await prisma.wishItem.findMany({
      where: { createdById: userId },
      include: {
        category: true
      }
    });

    const transformedUser = {
      ...userData,
      enrolledActiveGroups: memberships.map(m => ({
        id: m.activeGroup.id,
        title: m.activeGroup.title,
        description: m.activeGroup.description,
        category: m.activeGroup.category?.name,
        company: m.activeGroup.company?.title,
        basePrice: m.activeGroup.basePrice,
        groupPrice: m.activeGroup.groupPrice,
        participants: m.activeGroup.participants.map(p => ({
          name: "משתמש", // We don't have other users' names in local DB anymore
          image: "",
        })),
        minParticipants: m.activeGroup.minParticipants,
        maxParticipants: m.activeGroup.maxParticipants,
        deadline: m.activeGroup.deadline,
        status: m.activeGroup.status,
        createdAt: m.activeGroup.createdAt,
        joinedAt: m.joinedAt,
        images: m.activeGroup.images.map(img => img.image.url)
      })),

      wishItems: wishItems.map(item => ({
        id: item.id,
        text: item.text,
        targetPrice: item.targetPrice,
        categoryName: item.category?.name,
        createdAt: item.createdAt,
        authorName: userData.name,
        authorAvatar: userData.profilePicture,
        likeCount: 0,
        isLikedByMe: false,
      }))
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return NextResponse.json({ error: "עדכון פרופיל מתבצע דרך Clerk" }, { status: 405 });
}
