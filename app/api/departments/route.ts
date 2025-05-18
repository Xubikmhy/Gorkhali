import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(
      `SELECT id, name, created_at 
       FROM departments 
       ORDER BY name`,
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 })
    }

    // Check if department already exists
    const checkResult = await query("SELECT id FROM departments WHERE name = $1", [name])

    if (checkResult.rows.length > 0) {
      return NextResponse.json({ error: "Department already exists" }, { status: 409 })
    }

    const result = await query("INSERT INTO departments (name) VALUES ($1) RETURNING id, name, created_at", [name])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating department:", error)
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 })
  }
}
