import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/users", "/products", "/orders", "/profile", "/settings"];
const PUBLIC = ["/login", "/register"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Use the secondary auth cookie for route protection
    const hasAuth = req.cookies.get("_auth")?.value === "1";

    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p));

    if (isProtected && !hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        // If they were on a protected page, they should be sent to login
        return NextResponse.redirect(url);
    }

    if (isPublic && hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        // If they have an auth cookie and try to hit login, send them to dashboard
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
