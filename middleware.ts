import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session");

  // Allow requests to the sign-in page or other public pages
  if (req.nextUrl.pathname.startsWith("/sign-in") || req.nextUrl.pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the sign-in page
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow authenticated users to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Apply middleware to specific routes
};