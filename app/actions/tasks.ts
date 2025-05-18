"use server"

import { revalidatePath } from "next/cache"
import {
  getTasks,
  getTasksByEmployeeId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  type Task,
} from "@/lib/db/tasks"

export async function fetchTasks() {
  try {
    return { success: true, data: await getTasks() }
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return { success: false, error: "Failed to fetch tasks" }
  }
}

export async function fetchTasksByEmployeeId(employeeId: number) {
  try {
    return { success: true, data: await getTasksByEmployeeId(employeeId) }
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return { success: false, error: "Failed to fetch tasks" }
  }
}

export async function fetchTaskById(id: number) {
  try {
    const task = await getTaskById(id)
    if (!task) {
      return { success: false, error: "Task not found" }
    }
    return { success: true, data: task }
  } catch (error) {
    console.error("Error fetching task:", error)
    return { success: false, error: "Failed to fetch task" }
  }
}

export async function addTask(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const employeeId = Number.parseInt(formData.get("employeeId") as string)
    const dueDate = formData.get("dueDate") as string
    const status = (formData.get("status") as string) || "Pending"

    if (!title || !employeeId || !dueDate) {
      return { success: false, error: "Missing required fields" }
    }

    const task = await createTask({
      title,
      description,
      employee_id: employeeId,
      due_date: dueDate,
      status,
    })

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error creating task:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function editTask(id: number, formData: FormData) {
  try {
    const updates: Partial<Task> = {}

    const title = formData.get("title")
    if (title) updates.title = title as string

    const description = formData.get("description")
    if (description) updates.description = description as string

    const employeeId = formData.get("employeeId")
    if (employeeId) updates.employee_id = Number.parseInt(employeeId as string)

    const dueDate = formData.get("dueDate")
    if (dueDate) updates.due_date = dueDate as string

    const status = formData.get("status")
    if (status) updates.status = status as string

    const task = await updateTask(id, updates)

    if (!task) {
      return { success: false, error: "Task not found" }
    }

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false, error: "Failed to update task" }
  }
}

export async function updateTaskStatus(id: number, status: string) {
  try {
    const task = await updateTask(id, { status })

    if (!task) {
      return { success: false, error: "Task not found" }
    }

    revalidatePath("/admin/tasks")
    return { success: true, data: task }
  } catch (error) {
    console.error("Error updating task status:", error)
    return { success: false, error: "Failed to update task status" }
  }
}

export async function removeTask(id: number) {
  try {
    const result = await deleteTask(id)

    if (!result) {
      return { success: false, error: "Task not found" }
    }

    revalidatePath("/admin/tasks")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}
