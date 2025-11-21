import { NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { GroupStatus } from "lib/types/status";

export async function GET() {
  try {
    const { session, response } = await validateSession();
    if (response) return response;

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
                        id: true,
                        name: true,
                        email: true,
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
                        id: true,
                        name: true,
                        email: true,
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
            participants: true, //TODO: Fetch length instead
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
                    id: true,
                    name: true,
                    email: true,
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
        },
        activeGroups: {
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
                    id: true,
                    name: true,
                    email: true,
                    profilePicture: { select: { url: true } }
                  }
                }
              }
            },
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    }

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
            id: p.user.id,
            name: p.user.name || "",
            image: p.user.profilePicture?.url || "",
            mail: p.user.email
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
          id: p.user.id,
          name: p.user.name || "",
          image: p.user.profilePicture?.url || "",
          mail: p.user.email
        })),
        minParticipants: membership.activeGroup.minParticipants,
        maxParticipants: membership.activeGroup.maxParticipants,
        deadline: membership.activeGroup.deadline,
        status: membership.activeGroup.status,
        createdAt: membership.activeGroup.createdAt,
        joinedAt: membership.joinedAt,
        images: membership.activeGroup.images.map(img => img.image.url)
      })),
      ownedRequestGroups: user.requestGroups.map(group => ({
        id: group.id,
        title: group.title,
        description: group.description,
        category: group.category?.name,
        status: group.status,
        createdAt: group.createdAt,
        images: group.images.map(img => img.image.url),
        participants: group.participants,
        openedGroups: [] //TODO: Fix this shitty shit as well
      })),
      ownedActiveGroups: user.activeGroups.map(group => ({
        id: group.id,
        title: group.title,
        description: group.description,
        category: group.category?.name,
        company: group.company?.title,
        basePrice: group.basePrice,
        groupPrice: group.groupPrice,
        minParticipants: group.minParticipants,
        maxParticipants: group.maxParticipants,
        deadline: group.deadline,
        status: group.status,
        createdAt: group.createdAt,
        images: group.images.map(img => img.image.url)
      })),
      pendingRequestGroups: user.requestGroups
        .filter(group => group.status === GroupStatus.PENDING)
        .map(group => ({
          id: group.id,
          title: group.title,
          description: group.description,
          category: group.category?.name || "",
          status: group.status,
          createdAt: group.createdAt,
          images: group.images.length ? group.images.map(img => img.image.url) : ["/InaClubLogo.png"],
          participants: group.participants.map(p => ({
            id: p.user.id,
            name: p.user.name || "",
            image: p.user.profilePicture?.url || "",
            mail: p.user.email
          })),
          openedGroups: group.activeGroups.map(ag => ({ id: ag.id }))
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
