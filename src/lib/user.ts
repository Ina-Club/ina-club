import { getClerkUser } from "@/lib/auth";

export async function getCurrentUser() {
  return await getClerkUser();
}
