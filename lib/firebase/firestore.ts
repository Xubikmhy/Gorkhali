import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  type Timestamp,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./config"

// Check if we're in demo/preview mode
const isDemoMode =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key"

// Mock data for demo mode
const mockEmployees = [
  {
    id: "john-uid",
    firstName: "John",
    department: "Printing",
    phone: "555-1234",
    employmentType: "Full-time",
    salaryType: "Hourly",
    rate: 15,
    status: "Active",
    createdAt: { toDate: () => new Date() },
  },
  {
    id: "sarah-uid",
    firstName: "Sarah",
    department: "Design",
    phone: "555-5678",
    employmentType: "Full-time",
    salaryType: "Monthly",
    rate: 3000,
    status: "Active",
    createdAt: { toDate: () => new Date() },
  },
  {
    id: "mike-uid",
    firstName: "Mike",
    department: "Binding",
    phone: "555-9012",
    employmentType: "Part-time",
    salaryType: "Hourly",
    rate: 12,
    status: "Active",
    createdAt: { toDate: () => new Date() },
  },
]

const mockDepartments = [
  { id: "dept1", name: "Printing", createdAt: { toDate: () => new Date() } },
  { id: "dept2", name: "Design", createdAt: { toDate: () => new Date() } },
  { id: "dept3", name: "Binding", createdAt: { toDate: () => new Date() } },
  { id: "dept4", name: "Office", createdAt: { toDate: () => new Date() } },
]

const mockTasks = [
  {
    id: "task1",
    title: "Complete monthly report",
    description: "Prepare the monthly sales report for the management team.",
    employeeId: "john-uid",
    dueDate: "2025-05-20",
    status: "In Progress",
    createdAt: { toDate: () => new Date() },
  },
  {
    id: "task2",
    title: "Design new brochure",
    description: "Create a new brochure design for the upcoming product launch.",
    employeeId: "sarah-uid",
    dueDate: "2025-05-25",
    status: "Pending",
    createdAt: { toDate: () => new Date() },
  },
  {
    id: "task3",
    title: "Fix printer issues",
    description: "Troubleshoot and fix the issues with the main printer.",
    employeeId: "mike-uid",
    dueDate: "2025-05-18",
    status: "Completed",
    createdAt: { toDate: () => new Date() },
  },
]

const mockAnnouncements = [
  {
    id: "ann1",
    title: "Office Closure",
    message: "The office will be closed on May 25th for maintenance. Please plan accordingly.",
    createdAt: { toDate: () => new Date(2025, 4, 15) },
    expiresAt: new Date(2025, 5, 15),
  },
  {
    id: "ann2",
    title: "New Equipment Arrival",
    message: "New printing equipment will be delivered next week. Training sessions will be scheduled soon.",
    createdAt: { toDate: () => new Date(2025, 4, 10) },
    expiresAt: new Date(2025, 5, 10),
  },
]

// Mock user roles
const mockUserRoles = {
  "admin-uid": "admin",
  "john-uid": "employee",
  "sarah-uid": "employee",
  "mike-uid": "employee",
}

// User related functions
export async function createUserDocument(uid: string, userData: any) {
  try {
    if (isDemoMode) {
      return true
    }

    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: serverTimestamp(),
    })

    // Also create an employee document if role is employee
    if (userData.role === "employee") {
      await setDoc(doc(db, "employees", uid), {
        firstName: userData.firstName,
        department: userData.department,
        phone: userData.phone || "",
        employmentType: userData.employmentType,
        salaryType: userData.salaryType,
        rate: userData.rate,
        status: "Active",
        createdAt: serverTimestamp(),
      })
    }

    return true
  } catch (error) {
    console.error("Error creating user document:", error)
    throw error
  }
}

export async function getUserRole(uid: string) {
  try {
    if (isDemoMode) {
      // Return mock role for demo mode
      return mockUserRoles[uid as keyof typeof mockUserRoles] || null
    }

    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data().role
    }
    return null
  } catch (error) {
    console.error("Error getting user role:", error)
    throw error
  }
}

// Department related functions
export async function createDepartment(name: string) {
  try {
    if (isDemoMode) {
      return true
    }

    // Check if department already exists
    const departmentsRef = collection(db, "departments")
    const q = query(departmentsRef, where("name", "==", name))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      throw new Error("Department already exists")
    }

    await addDoc(departmentsRef, {
      name,
      createdAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error creating department:", error)
    throw error
  }
}

export async function getDepartments() {
  try {
    if (isDemoMode) {
      // Return mock departments for demo mode
      return [...mockDepartments]
    }

    const departmentsRef = collection(db, "departments")
    const q = query(departmentsRef, orderBy("name"))
    const querySnapshot = await getDocs(q)

    const departments: any[] = []
    querySnapshot.forEach((doc) => {
      departments.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return departments
  } catch (error) {
    console.error("Error getting departments:", error)
    throw error
  }
}

// Employee related functions
export async function getEmployees() {
  try {
    if (isDemoMode) {
      // Return mock employees for demo mode
      return [...mockEmployees]
    }

    const employeesRef = collection(db, "employees")
    const q = query(employeesRef, orderBy("firstName"))
    const querySnapshot = await getDocs(q)

    const employees: any[] = []
    querySnapshot.forEach((doc) => {
      employees.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return employees
  } catch (error) {
    console.error("Error getting employees:", error)
    throw error
  }
}

export async function updateEmployee(id: string, data: any) {
  try {
    if (isDemoMode) {
      return true
    }

    await updateDoc(doc(db, "employees", id), {
      ...data,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error updating employee:", error)
    throw error
  }
}

// Attendance related functions
export async function punchIn(employeeId: string) {
  try {
    if (isDemoMode) {
      return true
    }

    const attendanceRef = collection(db, "attendance")

    await addDoc(attendanceRef, {
      employeeId,
      punchInTime: serverTimestamp(),
      punchOutTime: null,
      date: new Date().toISOString().split("T")[0],
      hours: 0,
    })

    return true
  } catch (error) {
    console.error("Error punching in:", error)
    throw error
  }
}

export async function punchOut(attendanceId: string, punchInTime: Timestamp) {
  try {
    if (isDemoMode) {
      return true
    }

    const punchOutTime = serverTimestamp()
    const attendanceRef = doc(db, "attendance", attendanceId)

    // Calculate hours (this is approximate since serverTimestamp is not available client-side)
    const now = new Date()
    const punchInDate = punchInTime.toDate()
    const hours = (now.getTime() - punchInDate.getTime()) / (1000 * 60 * 60)

    await updateDoc(attendanceRef, {
      punchOutTime,
      hours: Number.parseFloat(hours.toFixed(2)),
    })

    return true
  } catch (error) {
    console.error("Error punching out:", error)
    throw error
  }
}

// Task related functions
export async function createTask(taskData: any) {
  try {
    if (isDemoMode) {
      return true
    }

    const tasksRef = collection(db, "tasks")

    await addDoc(tasksRef, {
      ...taskData,
      createdAt: serverTimestamp(),
      status: "Pending",
    })

    return true
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export async function getTasks(employeeId?: string) {
  try {
    if (isDemoMode) {
      // Return filtered mock tasks for demo mode
      if (employeeId) {
        return mockTasks.filter((task) => task.employeeId === employeeId)
      }
      return [...mockTasks]
    }

    const tasksRef = collection(db, "tasks")
    let q

    if (employeeId) {
      q = query(tasksRef, where("employeeId", "==", employeeId), orderBy("dueDate"))
    } else {
      q = query(tasksRef, orderBy("dueDate"))
    }

    const querySnapshot = await getDocs(q)

    const tasks: any[] = []
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return tasks
  } catch (error) {
    console.error("Error getting tasks:", error)
    throw error
  }
}

export async function updateTask(id: string, data: any) {
  try {
    if (isDemoMode) {
      return true
    }

    await updateDoc(doc(db, "tasks", id), {
      ...data,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

// Announcement related functions
export async function createAnnouncement(announcementData: any) {
  try {
    if (isDemoMode) {
      return true
    }

    const announcementsRef = collection(db, "announcements")

    await addDoc(announcementsRef, {
      ...announcementData,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    })

    return true
  } catch (error) {
    console.error("Error creating announcement:", error)
    throw error
  }
}

export async function getAnnouncements() {
  try {
    if (isDemoMode) {
      // Return mock announcements for demo mode
      return [...mockAnnouncements]
    }

    const announcementsRef = collection(db, "announcements")
    const now = new Date()

    // Only get announcements that haven't expired
    const q = query(announcementsRef, where("expiresAt", ">", now), orderBy("expiresAt"), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)

    const announcements: any[] = []
    querySnapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return announcements
  } catch (error) {
    console.error("Error getting announcements:", error)
    throw error
  }
}

// Salary and advances related functions
export async function addAdvance(advanceData: any) {
  try {
    if (isDemoMode) {
      return true
    }

    const advancesRef = collection(db, "advances")

    await addDoc(advancesRef, {
      ...advanceData,
      date: new Date(advanceData.date),
      createdAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error adding advance:", error)
    throw error
  }
}

export async function getAdvances(employeeId?: string) {
  try {
    if (isDemoMode) {
      return []
    }

    const advancesRef = collection(db, "advances")
    let q

    if (employeeId) {
      q = query(advancesRef, where("employeeId", "==", employeeId), orderBy("date", "desc"))
    } else {
      q = query(advancesRef, orderBy("date", "desc"))
    }

    const querySnapshot = await getDocs(q)

    const advances: any[] = []
    querySnapshot.forEach((doc) => {
      advances.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return advances
  } catch (error) {
    console.error("Error getting advances:", error)
    throw error
  }
}

export async function calculateSalary(employeeId: string, month: number, year: number) {
  // This would be a more complex function that calculates salary based on attendance and advances
  // For simplicity, we're just returning a placeholder
  return {
    basePay: 0,
    advances: 0,
    netPayable: 0,
    hours: 0,
  }
}
