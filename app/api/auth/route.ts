import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { cookies } from "next/headers"
import { serialize } from "cookie"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const user = await signIn(username, password)

    // Create a session cookie
    const sessionCookie = serialize("session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    // Return the user data
    return NextResponse.json(
      { user },
      {
        status: 200,
        headers: { "Set-Cookie": sessionCookie },
      },
    )
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    try {
      const user = JSON.parse(sessionCookie.value)
      return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
      console.error("Error parsing session cookie:", error)
      return NextResponse.json({ user: null }, { status: 200 })
    }
  } catch (error) {
    console.error("Error in GET /api/auth:", error)
    return NextResponse.json({ user: null, error: "Authentication error" }, { status: 200 })
  }
}

export async function DELETE() {
  try {
    // Clear the session cookie
    const sessionCookie = serialize("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { "Set-Cookie": sessionCookie },
      },
    )
  } catch (error) {
    console.error("Error in DELETE /api/auth:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
