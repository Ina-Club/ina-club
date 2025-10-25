import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
    }

    // Check if user has completed their profile (has name and password)
    const hasCompleteProfile = user.name && user.password;

    // If user doesn't have complete profile, return basic info without groups data
    if (!hasCompleteProfile) {
      const basicProfile = {
        id: user.id,
        name: user.name || '',
        email: user.email,
        profilePicture: user.profilePicture?.url,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        enrolledRequestGroups: [],
        enrolledActiveGroups: [],
        ownedRequestGroups: [],
        ownedActiveGroups: []
      };
      return NextResponse.json(basicProfile);
    }

    // Transform the data to match the expected format
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture?.url,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      enrolledRequestGroups: user.requestGroupMemberships.map(membership => ({
        id: membership.requestGroup.id,
        title: membership.requestGroup.title,
        description: membership.requestGroup.description,
        category: membership.requestGroup.category?.name,
        status: membership.requestGroup.status,
        createdAt: membership.requestGroup.createdAt,
        joinedAt: membership.joinedAt,
        images: membership.requestGroup.images.map(img => img.image.url)
      })),
      enrolledActiveGroups: user.activeGroupMemberships.map(membership => ({
        id: membership.activeGroup.id,
        title: membership.activeGroup.title,
        description: membership.activeGroup.description,
        category: membership.activeGroup.category?.name,
        company: membership.activeGroup.company?.title,
        basePrice: membership.activeGroup.basePrice,
        groupPrice: membership.activeGroup.groupPrice,
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
        images: group.images.map(img => img.image.url)
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const { name, profilePictureUrl } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
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
