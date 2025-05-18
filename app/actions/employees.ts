"use server"

import { revalidatePath } from "next/cache"
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type Employee,
} from "@/lib/db/employees"

export async function fetchEmployees() {
  try {
    return { success: true, data: await getEmployees() }
  } catch (error) {
    console.error("Error fetching employees:", error)
    return { success: false, error: "Failed to fetch employees" }
  }
}

export async function fetchEmployeeById(id: number) {
  try {
    const employee = await getEmployeeById(id)
    if (!employee) {
      return { success: false, error: "Employee not found" }
    }
    return { success: true, data: employee }
  } catch (error) {
    console.error("Error fetching employee:", error)
    return { success: false, error: "Failed to fetch employee" }
  }
}

export async function addEmployee(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const departmentId = Number.parseInt(formData.get("departmentId") as string)
    const phone = formData.get("phone") as string
    const employmentType = formData.get("employmentType") as string
    const salaryType = formData.get("salaryType") as string
    const rate = Number.parseFloat(formData.get("rate") as string)

    if (!firstName || !departmentId || !employmentType || !salaryType || !rate) {
      return { success: false, error: "Missing required fields" }
    }

    const employee = await createEmployee({
      first_name: firstName,
      department_id: departmentId,
      phone,
      employment_type: employmentType,
      salary_type: salaryType,
      rate,
      status: "Active",
    })

    revalidatePath("/admin/employees")
    return { success: true, data: employee }
  } catch (error) {
    console.error("Error creating employee:", error)
    return { success: false, error: "Failed to create employee" }
  }
}

export async function editEmployee(id: number, formData: FormData) {
  try {
    const updates: Partial<Employee> = {}

    const firstName = formData.get("firstName")
    if (firstName) updates.first_name = firstName as string

    const departmentId = formData.get("departmentId")
    if (departmentId) updates.department_id = Number.parseInt(departmentId as string)

    const phone = formData.get("phone")
    if (phone) updates.phone = phone as string

    const employmentType = formData.get("employmentType")
    if (employmentType) updates.employment_type = employmentType as string

    const salaryType = formData.get("salaryType")
    if (salaryType) updates.salary_type = salaryType as string

    const rate = formData.get("rate")
    if (rate) updates.rate = Number.parseFloat(rate as string)

    const status = formData.get("status")
    if (status) updates.status = status as string

    const employee = await updateEmployee(id, updates)

    if (!employee) {
      return { success: false, error: "Employee not found" }
    }

    revalidatePath("/admin/employees")
    return { success: true, data: employee }
  } catch (error) {
    console.error("Error updating employee:", error)
    return { success: false, error: "Failed to update employee" }
  }
}

export async function updateEmployeeStatus(id: number, status: string) {
  try {
    const employee = await updateEmployee(id, { status })

    if (!employee) {
      return { success: false, error: "Employee not found" }
    }

    revalidatePath("/admin/employees")
    return { success: true, data: employee }
  } catch (error) {
    console.error("Error updating employee status:", error)
    return { success: false, error: "Failed to update employee status" }
  }
}

export async function removeEmployee(id: number) {
  try {
    const result = await deleteEmployee(id)

    if (!result) {
      return { success: false, error: "Employee not found" }
    }

    revalidatePath("/admin/employees")
    return { success: true }
  } catch (error) {
    console.error("Error deleting employee:", error)
    return { success: false, error: "Failed to delete employee" }
  }
}
