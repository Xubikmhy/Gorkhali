import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/" || path === "/login"

  // Get the auth cookie
  const authCookie = request.cookies.get("auth")?.value

  // If the user is not authenticated and trying to access a protected route
  if (!authCookie && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the user is authenticated and trying to access a public route
  if (authCookie && isPublicPath) {
    try {
      const user = JSON.parse(authCookie)
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      } else if (user.role === "employee") {
        return NextResponse.redirect(new URL("/employee/dashboard", request.url))
      }
    } catch (error) {
      // If there's an error parsing the cookie, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("auth")
      return response
    }
  }

  // Check role-specific paths
  if (authCookie) {
    try {
      const user = JSON.parse(authCookie)

      // Admin trying to access employee routes
      if (user.role === "admin" && path.startsWith("/employee")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }

      // Employee trying to access admin routes
      if (user.role === "employee" && path.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/employee/dashboard", request.url))
      }
    } catch (error) {
      // If there's an error parsing the cookie, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("auth")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
