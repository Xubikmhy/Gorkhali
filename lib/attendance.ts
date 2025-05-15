import { query } from "./db"

export async function getAttendance(filters?: {
  employeeId?: number
  startDate?: string
  endDate?: string
  departmentId?: number
}) {
  try {
    let sql = `
      SELECT a.id, a.employee_id, e.first_name as employee_name, 
             d.name as department, a.date, a.punch_in_time, 
             a.punch_out_time, a.hours
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
      WHERE 1=1
    `

    const params = []
    let paramIndex = 1

    if (filters?.employeeId) {
      sql += ` AND a.employee_id = $${paramIndex++}`
      params.push(filters.employeeId)
    }

    if (filters?.startDate) {
      sql += ` AND a.date >= $${paramIndex++}`
      params.push(filters.startDate)
    }

    if (filters?.endDate) {
      sql += ` AND a.date <= $${paramIndex++}`
      params.push(filters.endDate)
    }

    if (filters?.departmentId) {
      sql += ` AND d.id = $${paramIndex++}`
      params.push(filters.departmentId)
    }

    sql += " ORDER BY a.date DESC, a.punch_in_time DESC"

    const result = await query(sql, params)

    return result.rows
  } catch (error) {
    console.error("Error getting attendance:", error)
    throw error
  }
}

export async function punchIn(employeeId: number) {
  try {
    const now = new Date()
    const date = now.toISOString().split("T")[0]

    // Check if employee already punched in today and hasn't punched out
    const checkResult = await query(
      `SELECT id FROM attendance 
       WHERE employee_id = $1 AND date = $2 AND punch_out_time IS NULL`,
      [employeeId, date],
    )

    if (checkResult.rows.length > 0) {
      throw new Error("Employee already punched in")
    }

    const result = await query(
      `INSERT INTO attendance 
       (employee_id, punch_in_time, date, hours) 
       VALUES ($1, $2, $3, 0) 
       RETURNING id`,
      [employeeId, now, date],
    )

    return result.rows[0].id
  } catch (error) {
    console.error("Error punching in:", error)
    throw error
  }
}

export async function punchOut(attendanceId: number) {
  try {
    const now = new Date()

    // Get punch in time
    const attendanceResult = await query("SELECT punch_in_time FROM attendance WHERE id = $1", [attendanceId])

    if (attendanceResult.rows.length === 0) {
      throw new Error("Attendance record not found")
    }

    const punchInTime = new Date(attendanceResult.rows[0].punch_in_time)

    // Calculate hours
    const hours = (now.getTime() - punchInTime.getTime()) / (1000 * 60 * 60)

    const result = await query(
      `UPDATE attendance 
       SET punch_out_time = $1, hours = $2 
       WHERE id = $3 
       RETURNING id`,
      [now, Number.parseFloat(hours.toFixed(2)), attendanceId],
    )

    return result.rows.length > 0
  } catch (error) {
    console.error("Error punching out:", error)
    throw error
  }
}
