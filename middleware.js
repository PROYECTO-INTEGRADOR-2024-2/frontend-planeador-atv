// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    const role = payload.user_role;

    const path = req.nextUrl.pathname;

    // Redirección por rol
    if (path.startsWith("/admin") && role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

   

    if (path.startsWith("/tutor") && role == "ROLE_STUDENT") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Si tiene el rol correcto
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/tutor/:path*"],
};
