import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    let sql = `
      SELECT t.id, t.title, t.description, t.employee_id, 
             e.first_name as employee_name, d.name as department,
             t.due_date, t.status, t.created_at
      FROM tasks t
      JOIN employees e ON t.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
    `

    const params = []

    if (employeeId) {
      sql += " WHERE t.employee_id = $1"
      params.push(employeeId)
    }

    sql += " ORDER BY t.due_date"

    const result = await query(sql, params)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, employeeId, dueDate } = await request.json()

    if (!title || !employeeId || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO tasks 
       (title, description, employee_id, due_date, status) 
       VALUES ($1, $2, $3, $4, 'Pending') 
       RETURNING id, title, description, employee_id, due_date, status, created_at`,
      [title, description || null, employeeId, dueDate],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
