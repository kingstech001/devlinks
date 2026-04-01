import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/preview"];

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/links", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Check if there's a session cookie
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      // No session cookie found, redirect to login
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Session exists, allow access
    return NextResponse.next();
  }

  // For any other routes, allow them through
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes except static files and API routes that shouldn't be checked
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

