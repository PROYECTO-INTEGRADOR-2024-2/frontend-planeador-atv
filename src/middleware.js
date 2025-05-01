import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/login", "/register", "complete-reg", "/", "validate-email"];

async function verifyJWT(token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (err) {
      return null;
    }
  }

  export function middleware(request) {
    const { pathname } = request.nextUrl;
  
  
    const token = request.cookies.get("token")?.value;
    const user = request.cookies.get("user")?.value;
  
    if (token && user) {
      const isValid = verifyJWT(token);
      if (isValid) {
        const url = request.nextUrl.clone();
        url.pathname = "/landing";
        return NextResponse.redirect(url);
      }
    }

    if(!token){
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
  }

  export const config = {
    matcher: ["/login", "/register"],
  };