import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth-constants";
import { decideHostRoute } from "@/lib/links";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const decision = decideHostRoute(request.headers.get("host"), pathname, search);

  if (decision.action === "rewrite") {
    const url = request.nextUrl.clone();
    url.pathname = decision.pathname;
    return NextResponse.rewrite(url);
  }

  if (decision.action === "redirect") {
    return NextResponse.redirect(decision.destination, 308);
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!_next/static|_next/image|images/|favicon.ico|.*\\..*).*)"],
};
