import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(
      `SELECT e.id, e.first_name, d.name as department, e.phone, 
              e.employment_type, e.salary_type, e.rate, e.status, e.created_at
       FROM employees e
       JOIN departments d ON e.department_id = d.id
       ORDER BY e.first_name`,
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, departmentId, phone, employmentType, salaryType, rate } = await request.json()

    if (!firstName || !departmentId || !employmentType || !salaryType || !rate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO employees 
       (first_name, department_id, phone, employment_type, salary_type, rate, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Active') 
       RETURNING id, first_name, department_id, phone, employment_type, salary_type, rate, status, created_at`,
      [firstName, departmentId, phone || null, employmentType, salaryType, rate],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
