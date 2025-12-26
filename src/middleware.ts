
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    const protectedRoutes = ["/profile", "/smart-search", "/create", "/price-analyzer"];

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute) {
        if (!isAuth) {
            const url = new URL("/auth/signin", req.url);
            url.searchParams.set("message", "login_required");
            url.searchParams.set("callbackUrl", req.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/smart-search/:path*",
        "/create/:path*",
        "/price-analyzer/:path*",
    ],
};
