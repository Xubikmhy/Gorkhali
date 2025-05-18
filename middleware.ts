import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simplified middleware that doesn't rely on server-side auth
export function middleware(request: NextRequest) {
  // For the demo, we'll just let all requests through
  // In a real app, you'd check for authentication here
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
