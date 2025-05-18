import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs" // Changed from bcrypt to bcryptjs
import { query } from "@/lib/db"
import { serialize } from "cookie"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // For demo mode without proper database setup
    if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
      // Check demo credentials
      if (username === "admin" && password === "admin123") {
        const user = {
          id: 1,
          username: "admin",
          role: "admin",
          displayName: "Admin",
        }

        // Set cookie
        const cookieValue = serialize("auth", JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 3600, // 1 hour
          path: "/",
        })

        return NextResponse.json(
          { success: true, user },
          {
            headers: {
              "Set-Cookie": cookieValue,
            },
          },
        )
      } else if (["john", "sarah", "mike"].includes(username) && password === `${username}@123`) {
        const employeeId = username === "john" ? 1 : username === "sarah" ? 2 : 3
        const department = username === "john" ? "Printing" : username === "sarah" ? "Design" : "Binding"

        const user = {
          id: employeeId + 1, // User ID is different from employee ID
          username,
          role: "employee",
          employeeId,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          department,
          status: "Active",
        }

        // Set cookie
        const cookieValue = serialize("auth", JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 3600, // 1 hour
          path: "/",
        })

        return NextResponse.json(
          { success: true, user },
          {
            headers: {
              "Set-Cookie": cookieValue,
            },
          },
        )
      }

      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Get user from database
    const result = await query("SELECT id, username, password, role FROM users WHERE username = $1", [
      username.toLowerCase(),
    ])

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 })
    }

    // Compare password
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
    }

    // If user is an employee, get employee details
    let employeeDetails = null
    if (user.role === "employee") {
      const employeeResult = await query(
        `SELECT e.id, e.first_name, e.status, d.name as department
         FROM employees e
         JOIN departments d ON e.department_id = d.id
         WHERE e.first_name = $1`,
        [username],
      )

      if (employeeResult.rows.length > 0) {
        employeeDetails = employeeResult.rows[0]
      }
    }

    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      employeeId: employeeDetails?.id || null,
      displayName: employeeDetails?.first_name || user.username,
      department: employeeDetails?.department || null,
      status: employeeDetails?.status || null,
    }

    // Set cookie
    const cookieValue = serialize("auth", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    })

    return NextResponse.json(
      { success: true, user: userData },
      {
        headers: {
          "Set-Cookie": cookieValue,
        },
      },
    )
  } catch (error) {
    console.error("API auth error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}

export async function DELETE() {
  // Clear the auth cookie
  const cookieValue = serialize("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    path: "/",
  })

  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": cookieValue,
      },
    },
  )
}
