import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/", "/api/auth", "/auth", "/api/register", "/_next", "/favicon.ico"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  // protect /organizer routes
  if (pathname.startsWith("/organizer")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "organizer") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // protect /user/dashboard & booking if you want (example)
  if (pathname.startsWith("/user") || pathname.startsWith("/booking")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/organizer/:path*", "/user/:path*", "/booking/:path*", "/api/protected/:path*"]
};
