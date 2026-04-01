import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Allow all routes without protection
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes except static files and API routes that shouldn't be checked
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

