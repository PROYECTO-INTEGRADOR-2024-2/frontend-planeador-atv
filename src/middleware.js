import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/login", "/register"];

async function verifyJWT(token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Asegúrate de definir JWT_SECRET en tu .env
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (err) {
      return null;
    }
  }

  export async function middleware(request) {
    const { pathname } = request.nextUrl;
  
    if (!protectedRoutes.includes(pathname)) return NextResponse.next();
  
    const token = request.cookies.get("token")?.value;
    const user = request.cookies.get("user")?.value;
  
    if (token && user) {
      const isValid = await verifyJWT(token);
      if (isValid) {
        const url = request.nextUrl.clone();
        url.pathname = "/landing";
        return NextResponse.redirect(url);
      }
    }
  
    return NextResponse.next();
  }

  export const config = {
    matcher: ["/login", "/register"],
  };