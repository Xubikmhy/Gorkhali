"use server"

import { revalidatePath } from "next/cache"
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentWithEmployeeCount,
} from "@/lib/db/departments"

export async function fetchDepartments() {
  try {
    return { success: true, data: await getDepartments() }
  } catch (error) {
    console.error("Error fetching departments:", error)
    return { success: false, error: "Failed to fetch departments" }
  }
}

export async function fetchDepartmentsWithEmployeeCount() {
  try {
    return { success: true, data: await getDepartmentWithEmployeeCount() }
  } catch (error) {
    console.error("Error fetching departments with employee count:", error)
    return { success: false, error: "Failed to fetch departments" }
  }
}

export async function fetchDepartmentById(id: number) {
  try {
    const department = await getDepartmentById(id)
    if (!department) {
      return { success: false, error: "Department not found" }
    }
    return { success: true, data: department }
  } catch (error) {
    console.error("Error fetching department:", error)
    return { success: false, error: "Failed to fetch department" }
  }
}

export async function addDepartment(formData: FormData) {
  try {
    const name = formData.get("name") as string

    if (!name) {
      return { success: false, error: "Department name is required" }
    }

    const department = await createDepartment(name)
    revalidatePath("/admin/departments")
    return { success: true, data: department }
  } catch (error) {
    console.error("Error creating department:", error)
    return { success: false, error: "Failed to create department" }
  }
}

export async function editDepartment(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string

    if (!name) {
      return { success: false, error: "Department name is required" }
    }

    const department = await updateDepartment(id, name)

    if (!department) {
      return { success: false, error: "Department not found" }
    }

    revalidatePath("/admin/departments")
    return { success: true, data: department }
  } catch (error) {
    console.error("Error updating department:", error)
    return { success: false, error: "Failed to update department" }
  }
}

export async function removeDepartment(id: number) {
  try {
    const result = await deleteDepartment(id)

    if (!result) {
      return { success: false, error: "Department not found" }
    }

    revalidatePath("/admin/departments")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting department:", error)
    return {
      success: false,
      error:
        error.message === "Cannot delete department with employees"
          ? "Cannot delete department with employees"
          : "Failed to delete department",
    }
  }
}
