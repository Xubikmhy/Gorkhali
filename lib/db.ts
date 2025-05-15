import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string
export const sql = neon(process.env.DATABASE_URL!)

// Helper function for raw SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const result = await sql.query(sql, params)
    return {
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
