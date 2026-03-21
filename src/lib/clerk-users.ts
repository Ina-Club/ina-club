import { clerkClient } from "@clerk/nextjs/server";

export type ClerkPublicUser = {
  id: string;
  name: string;
  imageUrl: string;
};

export async function getClerkPublicUsersMap(userIds: string[]) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const map = new Map<string, ClerkPublicUser>();

  if (!uniqueIds.length) return map;

  const client = await clerkClient();

  await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const user = await client.users.getUser(id);
        map.set(id, {
          id,
          name:
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
            user.username ||
            "משתמש",
          imageUrl: user.imageUrl ?? "",
        });
      } catch {
        map.set(id, { id, name: "משתמש", imageUrl: "" });
      }
    })
  );

  return map;
}
