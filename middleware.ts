import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthSecret, SESSION_COOKIE_NAME } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/perfil"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await jwtVerify(token, getAuthSecret());
      return NextResponse.next();
    } catch {
      // Continua para o redirecionamento abaixo.
    }
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/perfil/:path*"],
};
