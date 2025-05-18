import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hash } from "bcryptjs" // Changed from bcrypt to bcryptjs

export async function GET() {
  try {
    const result = await query(
      `SELECT e.id, e.first_name, e.phone, e.employment_type, 
              e.salary_type, e.rate, e.status, d.name as department
       FROM employees e
       JOIN departments d ON e.department_id = d.id
       ORDER BY e.first_name`,
    )

    return NextResponse.json({ success: true, employees: result.rows })
  } catch (error) {
    console.error("API get employees error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, departmentId, phone, employmentType, salaryType, rate } = await request.json()

    // Start a transaction
    await query("BEGIN")

    // Create employee record
    const employeeResult = await query(
      `INSERT INTO employees 
       (first_name, department_id, phone, employment_type, salary_type, rate, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Active') 
       RETURNING id`,
      [firstName, departmentId, phone, employmentType, salaryType, rate],
    )

    const employeeId = employeeResult.rows[0].id

    // Create user record
    const username = firstName.toLowerCase()
    const password = `${firstName}@123`
    const hashedPassword = await hash(password, 10)

    await query(
      `INSERT INTO users 
       (username, password, role) 
       VALUES ($1, $2, 'employee')`,
      [username, hashedPassword],
    )

    // Commit transaction
    await query("COMMIT")

    return NextResponse.json({
      success: true,
      employee: {
        id: employeeId,
        firstName,
        departmentId,
        phone,
        employmentType,
        salaryType,
        rate,
        status: "Active",
      },
    })
  } catch (error) {
    // Rollback transaction on error
    await query("ROLLBACK")
    console.error("API create employee error:", error)
    return NextResponse.json({ success: false, error: "Failed to create employee" }, { status: 500 })
  }
}
