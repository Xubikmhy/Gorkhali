import { query } from "./db"

export async function getEmployees() {
  try {
    const result = await query(
      `SELECT e.id, e.first_name, d.name as department, e.phone, 
              e.employment_type, e.salary_type, e.rate, e.status
       FROM employees e
       JOIN departments d ON e.department_id = d.id
       ORDER BY e.first_name`,
    )

    return result.rows
  } catch (error) {
    console.error("Error getting employees:", error)
    throw error
  }
}

export async function getEmployee(id: number) {
  try {
    const result = await query(
      `SELECT e.id, e.first_name, e.department_id, d.name as department, 
              e.phone, e.employment_type, e.salary_type, e.rate, e.status
       FROM employees e
       JOIN departments d ON e.department_id = d.id
       WHERE e.id = $1`,
      [id],
    )

    return result.rows[0]
  } catch (error) {
    console.error("Error getting employee:", error)
    throw error
  }
}

export async function updateEmployee(
  id: number,
  data: {
    firstName?: string
    departmentId?: number
    phone?: string
    employmentType?: string
    salaryType?: string
    rate?: number
    status?: string
  },
) {
  try {
    const { firstName, departmentId, phone, employmentType, salaryType, rate, status } = data

    // Build the SET part of the query dynamically based on provided fields
    const updates = []
    const values = []
    let paramIndex = 1

    if (firstName !== undefined) {
      updates.push(`first_name = $${paramIndex++}`)
      values.push(firstName)
    }

    if (departmentId !== undefined) {
      updates.push(`department_id = $${paramIndex++}`)
      values.push(departmentId)
    }

    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`)
      values.push(phone)
    }

    if (employmentType !== undefined) {
      updates.push(`employment_type = $${paramIndex++}`)
      values.push(employmentType)
    }

    if (salaryType !== undefined) {
      updates.push(`salary_type = $${paramIndex++}`)
      values.push(salaryType)
    }

    if (rate !== undefined) {
      updates.push(`rate = $${paramIndex++}`)
      values.push(rate)
    }

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }

    if (updates.length === 0) {
      return false // Nothing to update
    }

    // Add the ID parameter
    values.push(id)

    const result = await query(
      `UPDATE employees 
       SET ${updates.join(", ")} 
       WHERE id = $${paramIndex}
       RETURNING id`,
      values,
    )

    return result.rows.length > 0
  } catch (error) {
    console.error("Error updating employee:", error)
    throw error
  }
}
