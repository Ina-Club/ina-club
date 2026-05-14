import { clerkClient } from "@clerk/nextjs/server";

export type ClerkPublicUser = {
  id: string;
  name: string;
  imageUrl: string;
};

const USER_CHUNK_SIZE = 50;

export async function getClerkPublicUsersMap(userIds: string[]) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const usersMap = new Map<string, ClerkPublicUser>();

  if (!uniqueIds.length) return usersMap;

  const client = await clerkClient();
  for (let i = 0; i < uniqueIds.length; i += USER_CHUNK_SIZE) {
    const chunkIds = uniqueIds.slice(i, i + USER_CHUNK_SIZE);
    try {
      const users = await client.users.getUserList({ userId: chunkIds });
      users.data.forEach((user) => {
        usersMap.set(user.id, {
          id: user.id,
          name:
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
            user.username ||
            "משתמש",
          imageUrl: user.imageUrl ?? "",
        });
      });
    } catch {
      // If the batch call fails, add placeholder entries
      chunkIds.forEach((id) => {
        if (!usersMap.has(id)) {
          usersMap.set(id, { id, name: "משתמש", imageUrl: "" });
        }
      });
    }
  }

  // Fill placeholders for any IDs not returned by Clerk
  uniqueIds.forEach((id) => {
    if (!usersMap.has(id)) {
      usersMap.set(id, { id, name: "משתמש", imageUrl: "" });
    }
  });

  return usersMap;
}
