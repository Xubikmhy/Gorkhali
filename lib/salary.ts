import { query } from "./db"

export async function calculateSalaries(month: number, year: number) {
  try {
    // Get all employees
    const employeesResult = await query(
      `SELECT e.id, e.first_name, d.name as department, e.salary_type, e.rate
       FROM employees e
       JOIN departments d ON e.department_id = d.id
       WHERE e.status = 'Active'`,
    )

    const employees = employeesResult.rows

    // Get start and end dates for the month
    const startDate = new Date(year, month, 1).toISOString().split("T")[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]

    // Start a transaction
    await query("BEGIN")

    const salaries = []

    for (const employee of employees) {
      // Get advances for the employee in this month
      const advancesResult = await query(
        `SELECT SUM(amount) as total_advances
         FROM advances
         WHERE employee_id = $1 AND date >= $2 AND date <= $3`,
        [employee.id, startDate, endDate],
      )

      const totalAdvances = Number.parseFloat(advancesResult.rows[0]?.total_advances || "0")

      // Get base pay from employee record
      const basePay = Number.parseFloat(employee.rate)

      // Calculate net payable
      const netPayable = basePay - totalAdvances

      // Create or update salary record
      const salaryResult = await query(
        `INSERT INTO salaries 
         (employee_id, month, year, base_pay, advances, net_payable) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (employee_id, month, year) 
         DO UPDATE SET 
           base_pay = $4, 
           advances = $5, 
           net_payable = $6
         RETURNING id`,
        [employee.id, month, year, basePay, totalAdvances, netPayable],
      )

      salaries.push({
        id: employee.id,
        firstName: employee.first_name,
        department: employee.department,
        salaryType: employee.salary_type,
        basePay,
        advances: totalAdvances,
        netPayable,
      })
    }

    // Commit transaction
    await query("COMMIT")

    return salaries
  } catch (error) {
    // Rollback transaction on error
    await query("ROLLBACK")
    console.error("Error calculating salaries:", error)
    throw error
  }
}

export async function updateSalary(employeeId: number, month: number, year: number, basePay: number) {
  try {
    // Get advances for the employee in this month
    const startDate = new Date(year, month, 1).toISOString().split("T")[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0]

    const advancesResult = await query(
      `SELECT SUM(amount) as total_advances
       FROM advances
       WHERE employee_id = $1 AND date >= $2 AND date <= $3`,
      [employeeId, startDate, endDate],
    )

    const totalAdvances = Number.parseFloat(advancesResult.rows[0]?.total_advances || "0")

    // Calculate net payable
    const netPayable = basePay - totalAdvances

    // Update salary record
    const result = await query(
      `INSERT INTO salaries 
       (employee_id, month, year, base_pay, advances, net_payable) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (employee_id, month, year) 
       DO UPDATE SET 
         base_pay = $4, 
         advances = $5, 
         net_payable = $6
       RETURNING id`,
      [employeeId, month, year, basePay, totalAdvances, netPayable],
    )

    return result.rows.length > 0
  } catch (error) {
    console.error("Error updating salary:", error)
    throw error
  }
}

export async function getSalaryReport(month: number, year: number) {
  try {
    const result = await query(
      `SELECT s.employee_id as id, e.first_name, d.name as department, 
              s.base_pay, s.advances, s.net_payable
       FROM salaries s
       JOIN employees e ON s.employee_id = e.id
       JOIN departments d ON e.department_id = d.id
       WHERE s.month = $1 AND s.year = $2`,
      [month, year],
    )

    return result.rows
  } catch (error) {
    console.error("Error getting salary report:", error)
    throw error
  }
}

export async function getAdvances(employeeId?: number) {
  try {
    let sql = `
      SELECT a.id, a.employee_id, e.first_name as employee_name, 
             d.name as department, a.amount, a.date
      FROM advances a
      JOIN employees e ON a.employee_id = e.id
      JOIN departments d ON e.department_id = d.id
    `

    const params = []

    if (employeeId) {
      sql += " WHERE a.employee_id = $1"
      params.push(employeeId)
    }

    sql += " ORDER BY a.date DESC"

    const result = await query(sql, params)

    return result.rows
  } catch (error) {
    console.error("Error getting advances:", error)
    throw error
  }
}

export async function addAdvance(data: {
  employeeId: number
  amount: number
  date: string
}) {
  try {
    const { employeeId, amount, date } = data

    const result = await query(
      `INSERT INTO advances 
       (employee_id, amount, date) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [employeeId, amount, date],
    )

    // Get employee and department info for the return value
    const employeeResult = await query(
      `SELECT e.first_name as employee_name, d.name as department
       FROM employees e
       JOIN departments d ON e.department_id = d.id
       WHERE e.id = $1`,
      [employeeId],
    )

    const employee = employeeResult.rows[0]

    return {
      id: result.rows[0].id,
      employeeId,
      employeeName: employee.employee_name,
      department: employee.department,
      amount,
      date,
    }
  } catch (error) {
    console.error("Error adding advance:", error)
    throw error
  }
}

export async function updateAdvance(
  id: number,
  data: {
    employeeId?: number
    amount?: number
    date?: string
  },
) {
  try {
    const { employeeId, amount, date } = data

    // Build the SET part of the query dynamically based on provided fields
    const updates = []
    const values = []
    let paramIndex = 1

    if (employeeId !== undefined) {
      updates.push(`employee_id = $${paramIndex++}`)
      values.push(employeeId)
    }

    if (amount !== undefined) {
      updates.push(`amount = $${paramIndex++}`)
      values.push(amount)
    }

    if (date !== undefined) {
      updates.push(`date = $${paramIndex++}`)
      values.push(date)
    }

    if (updates.length === 0) {
      return false // Nothing to update
    }

    // Add the ID parameter
    values.push(id)

    const result = await query(
      `UPDATE advances 
       SET ${updates.join(", ")} 
       WHERE id = $${paramIndex}
       RETURNING id`,
      values,
    )

    return result.rows.length > 0
  } catch (error) {
    console.error("Error updating advance:", error)
    throw error
  }
}

export async function deleteAdvance(id: number) {
  try {
    const result = await query("DELETE FROM advances WHERE id = $1 RETURNING id", [id])

    return result.rows.length > 0
  } catch (error) {
    console.error("Error deleting advance:", error)
    throw error
  }
}
