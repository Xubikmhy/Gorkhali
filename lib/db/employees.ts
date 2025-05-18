import { query } from "@/lib/db"

export type Employee = {
  id: number
  first_name: string
  department_id: number
  department?: string
  phone: string | null
  employment_type: string
  salary_type: string
  rate: number
  status: string
  created_at: string
}

export async function getEmployees(): Promise<Employee[]> {
  const result = await query(
    `SELECT e.id, e.first_name, e.department_id, d.name as department, 
            e.phone, e.employment_type, e.salary_type, e.rate, e.status, e.created_at
     FROM employees e
     JOIN departments d ON e.department_id = d.id
     ORDER BY e.first_name`,
  )
  return result.rows
}

export async function getEmployeeById(id: number): Promise<Employee | null> {
  const result = await query(
    `SELECT e.id, e.first_name, e.department_id, d.name as department, 
            e.phone, e.employment_type, e.salary_type, e.rate, e.status, e.created_at
     FROM employees e
     JOIN departments d ON e.department_id = d.id
     WHERE e.id = $1`,
    [id],
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function createEmployee(employee: Omit<Employee, "id" | "created_at" | "department">): Promise<Employee> {
  const result = await query(
    `INSERT INTO employees 
     (first_name, department_id, phone, employment_type, salary_type, rate, status) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING id, first_name, department_id, phone, employment_type, salary_type, rate, status, created_at`,
    [
      employee.first_name,
      employee.department_id,
      employee.phone,
      employee.employment_type,
      employee.salary_type,
      employee.rate,
      employee.status || "Active",
    ],
  )
  return result.rows[0]
}

export async function updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee | null> {
  // Build the SET clause dynamically based on provided fields
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (employee.first_name !== undefined) {
    updates.push(`first_name = $${paramIndex++}`)
    values.push(employee.first_name)
  }

  if (employee.department_id !== undefined) {
    updates.push(`department_id = $${paramIndex++}`)
    values.push(employee.department_id)
  }

  if (employee.phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`)
    values.push(employee.phone)
  }

  if (employee.employment_type !== undefined) {
    updates.push(`employment_type = $${paramIndex++}`)
    values.push(employee.employment_type)
  }

  if (employee.salary_type !== undefined) {
    updates.push(`salary_type = $${paramIndex++}`)
    values.push(employee.salary_type)
  }

  if (employee.rate !== undefined) {
    updates.push(`rate = $${paramIndex++}`)
    values.push(employee.rate)
  }

  if (employee.status !== undefined) {
    updates.push(`status = $${paramIndex++}`)
    values.push(employee.status)
  }

  if (updates.length === 0) {
    return getEmployeeById(id)
  }

  values.push(id)

  const result = await query(
    `UPDATE employees 
     SET ${updates.join(", ")} 
     WHERE id = $${paramIndex} 
     RETURNING id, first_name, department_id, phone, employment_type, salary_type, rate, status, created_at`,
    values,
  )

  return result.rows.length > 0 ? result.rows[0] : null
}

export async function deleteEmployee(id: number): Promise<boolean> {
  const result = await query("DELETE FROM employees WHERE id = $1 RETURNING id", [id])
  return result.rows.length > 0
}
