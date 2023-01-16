import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export const config = {
  matcher: "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
};

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }
  if (token && pathname === "/login") {
    return NextResponse.redirect("http://localhost:3000");
  }
  if (!token && pathname !== "/login") {
    if (pathname === "/") {
      return NextResponse.redirect("http://localhost:3000/login");
    }
    return NextResponse.redirect(
      `http://localhost:3000/login?from=${pathname.replace("/", "")}`,
    );
  }
}
