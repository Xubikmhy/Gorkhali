import { query } from "./db"

export async function getAnnouncements() {
  try {
    const now = new Date().toISOString().split("T")[0]

    const result = await query(
      `SELECT id, title, message, expires_at, created_at
       FROM announcements
       WHERE expires_at >= $1
       ORDER BY created_at DESC`,
      [now],
    )

    return result.rows
  } catch (error) {
    console.error("Error getting announcements:", error)
    throw error
  }
}

export async function createAnnouncement(data: {
  title: string
  message: string
  expiresAt: string
}) {
  try {
    const { title, message, expiresAt } = data

    const result = await query(
      `INSERT INTO announcements 
       (title, message, expires_at) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [title, message, expiresAt],
    )

    return result.rows[0].id
  } catch (error) {
    console.error("Error creating announcement:", error)
    throw error
  }
}

export async function updateAnnouncement(
  id: number,
  data: {
    title?: string
    message?: string
    expiresAt?: string
  },
) {
  try {
    const { title, message, expiresAt } = data

    // Build the SET part of the query dynamically based on provided fields
    const updates = []
    const values = []
    let paramIndex = 1

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`)
      values.push(title)
    }

    if (message !== undefined) {
      updates.push(`message = $${paramIndex++}`)
      values.push(message)
    }

    if (expiresAt !== undefined) {
      updates.push(`expires_at = $${paramIndex++}`)
      values.push(expiresAt)
    }

    if (updates.length === 0) {
      return false // Nothing to update
    }

    // Add the ID parameter
    values.push(id)

    const result = await query(
      `UPDATE announcements 
       SET ${updates.join(", ")} 
       WHERE id = $${paramIndex}
       RETURNING id`,
      values,
    )

    return result.rows.length > 0
  } catch (error) {
    console.error("Error updating announcement:", error)
    throw error
  }
}

export async function deleteAnnouncement(id: number) {
  try {
    const result = await query("DELETE FROM announcements WHERE id = $1 RETURNING id", [id])

    return result.rows.length > 0
  } catch (error) {
    console.error("Error deleting announcement:", error)
    throw error
  }
}
