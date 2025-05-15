import { compare, hash } from "bcrypt"
import { query } from "./db"

export async function signIn(username: string, password: string) {
  try {
    // For demo mode without proper database setup
    if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
      // Check demo credentials
      if (username === "admin" && password === "admin123") {
        return {
          id: 1,
          username: "admin",
          role: "admin",
          displayName: "Admin",
        }
      } else if (["john", "sarah", "mike"].includes(username) && password === `${username}@123`) {
        const employeeId = username === "john" ? 1 : username === "sarah" ? 2 : 3
        const department = username === "john" ? "Printing" : username === "sarah" ? "Design" : "Binding"

        return {
          id: employeeId + 1, // User ID is different from employee ID
          username,
          role: "employee",
          employeeId,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          department,
          status: "Active",
        }
      }

      throw new Error("Invalid credentials")
    }

    // Get user from database
    const result = await query("SELECT id, username, password, role FROM users WHERE username = $1", [
      username.toLowerCase(),
    ])

    const user = result.rows[0]

    if (!user) {
      throw new Error("User not found")
    }

    // Compare password
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("Invalid password")
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

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      employeeId: employeeDetails?.id || null,
      displayName: employeeDetails?.first_name || user.username,
      department: employeeDetails?.department || null,
      status: employeeDetails?.status || null,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

export async function createUser(
  firstName: string,
  departmentId: number,
  phone: string,
  employmentType: string,
  salaryType: string,
  rate: number,
) {
  try {
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

    return {
      id: employeeId,
      firstName,
      username,
      role: "employee",
    }
  } catch (error) {
    // Rollback transaction on error
    await query("ROLLBACK")
    console.error("Create user error:", error)
    throw error
  }
}
