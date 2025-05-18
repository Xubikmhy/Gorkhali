import { query } from "@/lib/db"

export type Department = {
  id: number
  name: string
  created_at: string
}

export async function getDepartments(): Promise<Department[]> {
  const result = await query(
    `SELECT id, name, created_at 
     FROM departments 
     ORDER BY name`,
  )
  return result.rows
}

export async function getDepartmentById(id: number): Promise<Department | null> {
  const result = await query(
    `SELECT id, name, created_at 
     FROM departments 
     WHERE id = $1`,
    [id],
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function createDepartment(name: string): Promise<Department> {
  const result = await query(
    `INSERT INTO departments (name) 
     VALUES ($1) 
     RETURNING id, name, created_at`,
    [name],
  )
  return result.rows[0]
}

export async function updateDepartment(id: number, name: string): Promise<Department | null> {
  const result = await query(
    `UPDATE departments 
     SET name = $1 
     WHERE id = $2 
     RETURNING id, name, created_at`,
    [name, id],
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function deleteDepartment(id: number): Promise<boolean> {
  // Check if department has employees
  const employeeCheck = await query("SELECT COUNT(*) as count FROM employees WHERE department_id = $1", [id])

  if (Number.parseInt(employeeCheck.rows[0].count) > 0) {
    throw new Error("Cannot delete department with employees")
  }

  const result = await query("DELETE FROM departments WHERE id = $1 RETURNING id", [id])
  return result.rows.length > 0
}

export async function getDepartmentWithEmployeeCount(): Promise<(Department & { employee_count: number })[]> {
  const result = await query(
    `SELECT d.id, d.name, d.created_at, COUNT(e.id) as employee_count
     FROM departments d
     LEFT JOIN employees e ON d.id = e.department_id
     GROUP BY d.id, d.name, d.created_at
     ORDER BY d.name`,
  )
  return result.rows
}
