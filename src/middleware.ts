import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/smart-search(.*)",
  "/create(.*)",
  "/price-analyzer(.*)",
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Webhook routes must be fully public (server-to-server from Clerk)
  if (isPublicApiRoute(req)) return;
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
