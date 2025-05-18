import { neon } from "@neondatabase/serverless"
import { Pool } from "@neondatabase/serverless"

// Create a SQL client with the connection string
export const sql = neon(process.env.DATABASE_URL!)

// Create a connection pool for more complex operations
export const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Helper function for raw SQL queries
export async function query(text: string, params: any[] = []) {
  try {
    const result = await sql(text, params)
    return {
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for transactions
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
