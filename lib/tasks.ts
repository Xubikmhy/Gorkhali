import { query } from "./db"

export async function getTasks(employeeId?: number) {
  try {
    let sql = `
      SELECT t.id, t.title, t.description, t.employee_id, 
             e.first_name as employee_name, d.name as department,
             t.due_date, t.status
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

    return result.rows
  } catch (error) {
    console.error("Error getting tasks:", error)
    throw error
  }
}

export async function createTask(taskData: {
  title: string
  description: string
  employeeId: number
  dueDate: string
  status: string
}) {
  try {
    const { title, description, employeeId, dueDate, status } = taskData

    const result = await query(
      `INSERT INTO tasks 
       (title, description, employee_id, due_date, status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [title, description, employeeId, dueDate, status || "Pending"],
    )

    return result.rows[0].id
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export async function updateTask(
  id: number,
  data: {
    title?: string
    description?: string
    employeeId?: number
    dueDate?: string
    status?: string
  },
) {
  try {
    const { title, description, employeeId, dueDate, status } = data

    // Build the SET part of the query dynamically based on provided fields
    const updates = []
    const values = []
    let paramIndex = 1

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`)
      values.push(title)
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(description)
    }

    if (employeeId !== undefined) {
      updates.push(`employee_id = $${paramIndex++}`)
      values.push(employeeId)
    }

    if (dueDate !== undefined) {
      updates.push(`due_date = $${paramIndex++}`)
      values.push(dueDate)
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
      `UPDATE tasks 
       SET ${updates.join(", ")} 
       WHERE id = $${paramIndex}
       RETURNING id`,
      values,
    )

    return result.rows.length > 0
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}
