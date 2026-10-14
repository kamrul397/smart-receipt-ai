import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an authenticated user account
const protectedRoutes = ["/dashboard", "/report"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const { pathname, search } = request.nextUrl;

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    // If attempting to access a protected member page without an auth cookie
    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        // Preserve intended destination so they return after logging in
        loginUrl.searchParams.set("redirect", pathname + search);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/report/:path*"],
};
