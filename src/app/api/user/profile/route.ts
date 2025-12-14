import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { GroupStatus } from "lib/types/status";
import { validateSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");
    const summaryOnly = view === "summary";

    const { session, response } = await validateSession();
    if (response) return response;

    if (summaryOnly) {
      const user = await prisma.user.findUnique({
        where: { email: session.user!.email! },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          emailVerified: true,
          profilePicture: {
            select: { url: true },
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "משתמש לא נמצא" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        profilePicture: user.profilePicture?.url ?? null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user!.email! },
      include: {
        profilePicture: true,
        requestGroupMemberships: {
          include: {
            requestGroup: {
              include: {
                category: true,
                images: {
                  include: {
                    image: true
                  },
                  orderBy: {
                    order: 'asc'
                  }
                },
                participants: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        profilePicture: { select: { url: true } }
                      }
                    }
                  }
                },
                activeGroups: {
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        },
        activeGroupMemberships: {
          include: {
            activeGroup: {
              include: {
                category: true,
                company: true,
                images: {
                  include: {
                    image: true
                  },
                  orderBy: {
                    order: 'asc'
                  }
                },
                participants: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        profilePicture: { select: { url: true } }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        requestGroups: {
          include: {
            category: true,
            images: {
              include: {
                image: true
              },
              orderBy: {
                order: 'asc'
              }
            },
            participants: {
              include: {
                user: {
                  select: {
                    name: true,
                    profilePicture: { select: { url: true } }
                  }
                }
              }
            },
            activeGroups: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    }

    // TODO: Optimize this, retrieve required data in one query.
    // Transform the data to match the expected format
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture?.url,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      enrolledRequestGroups: user.requestGroupMemberships
        .filter(membership => membership.requestGroup.status === GroupStatus.OPEN)
        .map(membership => ({
          id: membership.requestGroup.id,
          title: membership.requestGroup.title,
          description: membership.requestGroup.description,
          category: membership.requestGroup.category?.name,
          status: membership.requestGroup.status,
          createdAt: membership.requestGroup.createdAt,
          joinedAt: membership.joinedAt,
          images: membership.requestGroup.images.length ? membership.requestGroup.images.map(img => img.image.url) : ["/InaClubLogo.png"],
          participants: membership.requestGroup.participants.map(p => ({
            name: p.user.name || "",
            image: p.user.profilePicture?.url || "",
          })),
          openedGroups: membership.requestGroup.activeGroups.map(ag => ({ id: ag.id }))
        })),
      enrolledActiveGroups: user.activeGroupMemberships.map(membership => ({
        id: membership.activeGroup.id,
        title: membership.activeGroup.title,
        description: membership.activeGroup.description,
        category: membership.activeGroup.category?.name,
        company: membership.activeGroup.company?.title,
        basePrice: membership.activeGroup.basePrice,
        groupPrice: membership.activeGroup.groupPrice,
        participants: membership.activeGroup.participants.map(p => ({
          name: p.user.name || "",
          image: p.user.profilePicture?.url || "",
        })),
        minParticipants: membership.activeGroup.minParticipants,
        maxParticipants: membership.activeGroup.maxParticipants,
        deadline: membership.activeGroup.deadline,
        status: membership.activeGroup.status,
        createdAt: membership.activeGroup.createdAt,
        joinedAt: membership.joinedAt,
        images: membership.activeGroup.images.map(img => img.image.url)
      })),
      waitingRequestGroups: user.requestGroups
        .filter(group => group.status !== GroupStatus.OPEN)
        .map(group => ({
          id: group.id,
          title: group.title,
          description: group.description,
          category: group.category?.name || "",
          status: group.status,
          createdAt: group.createdAt,
          images: group.images.length ? group.images.map(img => img.image.url) : ["/InaClubLogo.png"],
          participants: group.participants.map(p => ({
            name: p.user.name || "",
            image: p.user.profilePicture?.url || "",
          })),
          openedGroups: group.activeGroups.map(ag => ({ id: ag.id })),
          rejectionReason: group.rejectionReason
        }))
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { session, response } = await validateSession();
    if (response) return response;

    const { name, profilePictureUrl } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user!.email! },
      data: {
        name,
        profilePicture: profilePictureUrl
          ? {
            upsert: {
              create: { url: profilePictureUrl },
              update: { url: profilePictureUrl },
            },
          }
          : undefined,
      },
      include: {
        profilePicture: true,
      }
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture?.url,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
