import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/users", "/profile", "/settings"];
const PUBLIC = ["/login", "/register"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("accessToken")?.value ?? req.headers.get("authorization")?.split(" ")[1];

    // Check localStorage via a special cookie set by the frontend
    const hasAuth = req.cookies.get("_auth")?.value === "1";

    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p));

    if (isProtected && !hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (isPublic && hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
