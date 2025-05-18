"use server"

import { hash } from "bcryptjs" // Changed from bcrypt to bcryptjs
import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createEmployee(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const departmentId = Number.parseInt(formData.get("departmentId") as string)
    const phone = formData.get("phone") as string
    const employmentType = formData.get("employmentType") as string
    const salaryType = formData.get("salaryType") as string
    const rate = Number.parseFloat(formData.get("rate") as string)

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

    revalidatePath("/admin/employees")
    return { success: true, message: "Employee created successfully" }
  } catch (error) {
    // Rollback transaction on error
    await query("ROLLBACK")
    console.error("Create employee error:", error)
    return { success: false, message: "Failed to create employee" }
  }
}

export async function updateEmployee(formData: FormData) {
  try {
    const id = Number.parseInt(formData.get("id") as string)
    const firstName = formData.get("firstName") as string
    const departmentId = Number.parseInt(formData.get("departmentId") as string)
    const phone = formData.get("phone") as string
    const employmentType = formData.get("employmentType") as string
    const salaryType = formData.get("salaryType") as string
    const rate = Number.parseFloat(formData.get("rate") as string)
    const status = formData.get("status") as string

    await query(
      `UPDATE employees 
       SET first_name = $1, department_id = $2, phone = $3, 
           employment_type = $4, salary_type = $5, rate = $6, status = $7
       WHERE id = $8`,
      [firstName, departmentId, phone, employmentType, salaryType, rate, status, id],
    )

    revalidatePath("/admin/employees")
    return { success: true, message: "Employee updated successfully" }
  } catch (error) {
    console.error("Update employee error:", error)
    return { success: false, message: "Failed to update employee" }
  }
}

export async function deleteEmployee(id: number) {
  try {
    // Check if employee has any tasks
    const tasksResult = await query("SELECT COUNT(*) FROM tasks WHERE employee_id = $1", [id])
    if (Number.parseInt(tasksResult.rows[0].count) > 0) {
      return { success: false, message: "Cannot delete employee with assigned tasks" }
    }

    // Check if employee has attendance records
    const attendanceResult = await query("SELECT COUNT(*) FROM attendance WHERE employee_id = $1", [id])
    if (Number.parseInt(attendanceResult.rows[0].count) > 0) {
      return { success: false, message: "Cannot delete employee with attendance records" }
    }

    // Get employee username
    const employeeResult = await query("SELECT first_name FROM employees WHERE id = $1", [id])
    const username = employeeResult.rows[0].first_name.toLowerCase()

    // Start transaction
    await query("BEGIN")

    // Delete user record
    await query("DELETE FROM users WHERE username = $1", [username])

    // Delete employee record
    await query("DELETE FROM employees WHERE id = $1", [id])

    // Commit transaction
    await query("COMMIT")

    revalidatePath("/admin/employees")
    return { success: true, message: "Employee deleted successfully" }
  } catch (error) {
    // Rollback transaction on error
    await query("ROLLBACK")
    console.error("Delete employee error:", error)
    return { success: false, message: "Failed to delete employee" }
  }
}

export async function getEmployees() {
  try {
    const result = await query(
      `SELECT e.id, e.first_name, e.phone, e.employment_type, 
              e.salary_type, e.rate, e.status, d.name as department
       FROM employees e
       JOIN departments d ON e.department_id = d.id
       ORDER BY e.first_name`,
    )
    return result.rows
  } catch (error) {
    console.error("Get employees error:", error)
    return []
  }
}

export async function getEmployee(id: number) {
  try {
    const result = await query(
      `SELECT e.id, e.first_name, e.department_id, e.phone, 
              e.employment_type, e.salary_type, e.rate, e.status
       FROM employees e
       WHERE e.id = $1`,
      [id],
    )
    return result.rows[0]
  } catch (error) {
    console.error("Get employee error:", error)
    return null
  }
}
