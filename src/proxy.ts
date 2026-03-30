import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/** Paths that require any authenticated user */
const authPaths = ["/profile"];

/** Paths that require admin role */
const adminPaths = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = authPaths.some((p) => pathname.startsWith(p));
  const needsAdmin = adminPaths.some((p) => pathname.startsWith(p));

  if (!needsAuth && !needsAdmin) return NextResponse.next();

  const session = await auth();
  if (!session?.user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (needsAdmin && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
