import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";
import type { WebhookEvent } from "@clerk/nextjs/server";

/** OAuth provider domains — extend this list as you add more social logins. */
const OAUTH_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
]);

/**
 * Returns true when the newly-created user signed up through an OAuth /
 * social provider (Google, GitHub, …) rather than plain email + password.
 */
function isOAuthUser(data: WebhookEvent["data"]): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any;

  // Primary check: Clerk populates external_accounts for OAuth sign-ups
  if (
    Array.isArray(d.external_accounts) &&
    d.external_accounts.length > 0
  ) {
    return true;
  }

  return false;
}

/** Fetch a random DiceBear avatar and return it as a File ready for Clerk. */
async function generateDiceBearAvatar(seed: string): Promise<File> {
  const style = "avataaars-neutral";
  const url = `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=256`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`DiceBear returned ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  return new File([buffer], `${seed}-avatar.png`, { type: "image/png" });
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Missing CLERK_WEBHOOK_SECRET – add it from the Clerk Dashboard → Webhooks"
    );
  }

  /* ---- Verify signature ---- */
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  /* ---- Handle user.created ---- */
  if (evt.type === "user.created") {
    const userId = evt.data.id;

    if (!userId) {
      return new Response("Missing user ID", { status: 400 });
    }

    if (!isOAuthUser(evt.data)) {
      try {
        const avatarFile = await generateDiceBearAvatar(userId);
        const client = await clerkClient();
        await client.users.updateUserProfileImage(userId, {
          file: avatarFile,
        });
        console.log(`[webhook] Assigned DiceBear avatar to user ${userId}`);
      } catch (err) {
        console.error(`[webhook] Failed to set avatar for ${userId}:`, err);
        // Don't return an error – the user was still created successfully
      }
    } else {
      console.log(
        `[webhook] Skipping avatar – user ${userId} signed up via OAuth`
      );
    }
  }

  return new Response("OK", { status: 200 });
}
