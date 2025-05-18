import { query } from "@/lib/db"

export type Task = {
  id: number
  title: string
  description: string | null
  employee_id: number
  employee_name?: string
  department?: string
  due_date: string
  status: string
  created_at: string
}

export async function getTasks(): Promise<Task[]> {
  const result = await query(
    `SELECT t.id, t.title, t.description, t.employee_id, 
            e.first_name as employee_name, d.name as department,
            t.due_date, t.status, t.created_at
     FROM tasks t
     JOIN employees e ON t.employee_id = e.id
     JOIN departments d ON e.department_id = d.id
     ORDER BY t.due_date`,
  )
  return result.rows
}

export async function getTasksByEmployeeId(employeeId: number): Promise<Task[]> {
  const result = await query(
    `SELECT t.id, t.title, t.description, t.employee_id, 
            e.first_name as employee_name, d.name as department,
            t.due_date, t.status, t.created_at
     FROM tasks t
     JOIN employees e ON t.employee_id = e.id
     JOIN departments d ON e.department_id = d.id
     WHERE t.employee_id = $1
     ORDER BY t.due_date`,
    [employeeId],
  )
  return result.rows
}

export async function getTaskById(id: number): Promise<Task | null> {
  const result = await query(
    `SELECT t.id, t.title, t.description, t.employee_id, 
            e.first_name as employee_name, d.name as department,
            t.due_date, t.status, t.created_at
     FROM tasks t
     JOIN employees e ON t.employee_id = e.id
     JOIN departments d ON e.department_id = d.id
     WHERE t.id = $1`,
    [id],
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function createTask(
  task: Omit<Task, "id" | "created_at" | "employee_name" | "department">,
): Promise<Task> {
  const result = await query(
    `INSERT INTO tasks 
     (title, description, employee_id, due_date, status) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, title, description, employee_id, due_date, status, created_at`,
    [task.title, task.description, task.employee_id, task.due_date, task.status || "Pending"],
  )
  return result.rows[0]
}

export async function updateTask(id: number, task: Partial<Task>): Promise<Task | null> {
  // Build the SET clause dynamically based on provided fields
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (task.title !== undefined) {
    updates.push(`title = $${paramIndex++}`)
    values.push(task.title)
  }

  if (task.description !== undefined) {
    updates.push(`description = $${paramIndex++}`)
    values.push(task.description)
  }

  if (task.employee_id !== undefined) {
    updates.push(`employee_id = $${paramIndex++}`)
    values.push(task.employee_id)
  }

  if (task.due_date !== undefined) {
    updates.push(`due_date = $${paramIndex++}`)
    values.push(task.due_date)
  }

  if (task.status !== undefined) {
    updates.push(`status = $${paramIndex++}`)
    values.push(task.status)
  }

  if (updates.length === 0) {
    return getTaskById(id)
  }

  values.push(id)

  const result = await query(
    `UPDATE tasks 
     SET ${updates.join(", ")} 
     WHERE id = $${paramIndex} 
     RETURNING id, title, description, employee_id, due_date, status, created_at`,
    values,
  )

  return result.rows.length > 0 ? result.rows[0] : null
}

export async function deleteTask(id: number): Promise<boolean> {
  const result = await query("DELETE FROM tasks WHERE id = $1 RETURNING id", [id])
  return result.rows.length > 0
}
