import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path.startsWith("/api/")

  // Get the session token from cookies
  const token = request.cookies.get("session")?.value

  // Redirect logic
  if (!isPublicPath && !token) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (path === "/" && token) {
    // If already logged in and trying to access login page,
    // redirect to appropriate dashboard based on role
    // For simplicity, we'll redirect to admin dashboard
    // In a real app, you'd decode the token to get the role
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

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
