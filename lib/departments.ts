import { query } from "./db"

export async function getDepartments() {
  try {
    const result = await query(
      `SELECT d.id, d.name, COUNT(e.id) as employee_count
       FROM departments d
       LEFT JOIN employees e ON d.id = e.department_id
       GROUP BY d.id, d.name
       ORDER BY d.name`,
    )

    return result.rows
  } catch (error) {
    console.error("Error getting departments:", error)
    throw error
  }
}

export async function createDepartment(name: string) {
  try {
    // Check if department already exists
    const checkResult = await query("SELECT id FROM departments WHERE name = $1", [name])

    if (checkResult.rows.length > 0) {
      throw new Error("Department already exists")
    }

    const result = await query("INSERT INTO departments (name) VALUES ($1) RETURNING id", [name])

    return result.rows[0].id
  } catch (error) {
    console.error("Error creating department:", error)
    throw error
  }
}

export async function updateDepartment(id: number, name: string) {
  try {
    // Check if department already exists with this name
    const checkResult = await query("SELECT id FROM departments WHERE name = $1 AND id != $2", [name, id])

    if (checkResult.rows.length > 0) {
      throw new Error("Department already exists")
    }

    const result = await query("UPDATE departments SET name = $1 WHERE id = $2 RETURNING id", [name, id])

    return result.rows.length > 0
  } catch (error) {
    console.error("Error updating department:", error)
    throw error
  }
}

export async function deleteDepartment(id: number) {
  try {
    // Check if department has employees
    const checkResult = await query("SELECT id FROM employees WHERE department_id = $1 LIMIT 1", [id])

    if (checkResult.rows.length > 0) {
      throw new Error("Cannot delete department with employees")
    }

    const result = await query("DELETE FROM departments WHERE id = $1 RETURNING id", [id])

    return result.rows.length > 0
  } catch (error) {
    console.error("Error deleting department:", error)
    throw error
  }
}
