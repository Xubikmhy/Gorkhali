import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./config"
import { getEmployees as getEmployeesFirestore } from "./firestore"

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
    employmentType: "Monthly",
    salaryType: "Monthly",
    rate: 2000,
    status: "Active",
  },
  {
    id: "sarah-uid",
    firstName: "Sarah",
    department: "Design",
    phone: "555-5678",
    employmentType: "Monthly",
    salaryType: "Monthly",
    rate: 1800,
    status: "Active",
  },
  {
    id: "mike-uid",
    firstName: "Mike",
    department: "Binding",
    phone: "555-9012",
    employmentType: "Part-time",
    salaryType: "Monthly",
    rate: 1500,
    status: "Active",
  },
]

const mockAdvances = [
  {
    id: "adv1",
    employeeId: "john-uid",
    employeeName: "John",
    department: "Printing",
    amount: 200,
    date: "2025-05-10",
  },
  {
    id: "adv2",
    employeeId: "mike-uid",
    employeeName: "Mike",
    department: "Binding",
    amount: 100,
    date: "2025-05-15",
  },
]

const mockSalaries = [
  {
    id: "john-uid",
    firstName: "John",
    department: "Printing",
    salaryType: "Monthly",
    basePay: 2000,
    advances: 200,
    netPayable: 1800,
  },
  {
    id: "sarah-uid",
    firstName: "Sarah",
    department: "Design",
    salaryType: "Monthly",
    basePay: 1800,
    advances: 0,
    netPayable: 1800,
  },
  {
    id: "mike-uid",
    firstName: "Mike",
    department: "Binding",
    salaryType: "Monthly",
    basePay: 1500,
    advances: 100,
    netPayable: 1400,
  },
]

// Salary related functions
export async function calculateSalaries(month: number, year: number) {
  try {
    if (isDemoMode) {
      // Return mock salaries for demo mode
      return [...mockSalaries]
    }

    // Get all employees
    const employees = await getEmployees()

    // Get all advances for the month
    const advancesRef = collection(db, "advances")
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const q = query(
      advancesRef,
      where("date", ">=", startDate.toISOString().split("T")[0]),
      where("date", "<=", endDate.toISOString().split("T")[0]),
    )

    const advancesSnapshot = await getDocs(q)
    const advances: any[] = []

    advancesSnapshot.forEach((doc) => {
      advances.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    // Calculate salary for each employee
    const salaries = employees.map((employee) => {
      // Calculate total advances for this employee
      const employeeAdvances = advances.filter((adv) => adv.employeeId === employee.id)
      const totalAdvances = employeeAdvances.reduce((sum, adv) => sum + adv.amount, 0)

      // Get base pay from employee record
      const basePay = employee.rate || 0

      // Calculate net payable
      const netPayable = basePay - totalAdvances

      // Check if salary record already exists
      const salaryId = `${employee.id}-${year}-${month}`

      // Create or update salary record
      setDoc(
        doc(db, "salaries", salaryId),
        {
          employeeId: employee.id,
          month,
          year,
          basePay,
          advances: totalAdvances,
          netPayable,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      )

      return {
        id: employee.id,
        firstName: employee.firstName,
        department: employee.department,
        salaryType: employee.salaryType,
        basePay,
        advances: totalAdvances,
        netPayable,
      }
    })

    return salaries
  } catch (error) {
    console.error("Error calculating salaries:", error)
    throw error
  }
}

export async function updateSalary(employeeId: string, month: number, year: number, basePay: number) {
  try {
    if (isDemoMode) {
      return true
    }

    // Get employee advances
    const advancesRef = collection(db, "advances")
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const q = query(
      advancesRef,
      where("employeeId", "==", employeeId),
      where("date", ">=", startDate.toISOString().split("T")[0]),
      where("date", "<=", endDate.toISOString().split("T")[0]),
    )

    const advancesSnapshot = await getDocs(q)
    let totalAdvances = 0

    advancesSnapshot.forEach((doc) => {
      totalAdvances += doc.data().amount
    })

    // Calculate net payable
    const netPayable = basePay - totalAdvances

    // Update salary record
    const salaryId = `${employeeId}-${year}-${month}`

    await setDoc(
      doc(db, "salaries", salaryId),
      {
        employeeId,
        month,
        year,
        basePay,
        advances: totalAdvances,
        netPayable,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    return true
  } catch (error) {
    console.error("Error updating salary:", error)
    throw error
  }
}

export async function getSalaryReport(month: number, year: number) {
  try {
    if (isDemoMode) {
      // Return mock salaries for demo mode
      return [...mockSalaries]
    }

    // Get all salary records for the month
    const salariesRef = collection(db, "salaries")
    const q = query(salariesRef, where("month", "==", month), where("year", "==", year))

    const salariesSnapshot = await getDocs(q)
    const salaries: any[] = []

    // Get all employees for additional data
    const employees = await getEmployees()

    salariesSnapshot.forEach((doc) => {
      const salaryData = doc.data()
      const employee = employees.find((emp) => emp.id === salaryData.employeeId)

      if (employee) {
        salaries.push({
          id: employee.id,
          firstName: employee.firstName,
          department: employee.department,
          basePay: salaryData.basePay,
          advances: salaryData.advances,
          netPayable: salaryData.netPayable,
        })
      }
    })

    return salaries
  } catch (error) {
    console.error("Error getting salary report:", error)
    throw error
  }
}

export async function exportSalaryReportCSV(month: number, year: number) {
  try {
    // Get the report data
    const reportData = await getSalaryReport(month, year)

    if (reportData.length === 0) {
      throw new Error("No data to export")
    }

    // Convert to CSV
    const headers = ["Employee", "Department", "Base Pay", "Advances", "Net Payable"]
    const rows = reportData.map((item) => [
      item.firstName,
      item.department,
      item.basePay.toFixed(2),
      item.advances.toFixed(2),
      item.netPayable.toFixed(2),
    ])

    // Add totals row
    const totals = reportData.reduce(
      (acc, item) => {
        acc.basePay += item.basePay
        acc.advances += item.advances
        acc.netPayable += item.netPayable
        return acc
      },
      { basePay: 0, advances: 0, netPayable: 0 },
    )

    rows.push(["TOTAL", "", totals.basePay.toFixed(2), totals.advances.toFixed(2), totals.netPayable.toFixed(2)])

    // Create CSV content
    let csvContent = headers.join(",") + "\n"
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })

    // Download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `salary-report-${year}-${month + 1}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error("Error exporting salary report:", error)
    throw error
  }
}

// Advance related functions
export async function getAdvances() {
  try {
    if (isDemoMode) {
      // Return mock advances for demo mode
      return [...mockAdvances]
    }

    const advancesRef = collection(db, "advances")
    const q = query(advancesRef, orderBy("date", "desc"))
    const querySnapshot = await getDocs(q)

    const advances: any[] = []
    const employees = await getEmployees()

    querySnapshot.forEach((doc) => {
      const advanceData = doc.data()
      const employee = employees.find((emp) => emp.id === advanceData.employeeId)

      advances.push({
        id: doc.id,
        ...advanceData,
        employeeName: employee ? employee.firstName : "Unknown",
        department: employee ? employee.department : "Unknown",
      })
    })

    return advances
  } catch (error) {
    console.error("Error getting advances:", error)
    throw error
  }
}

export async function addAdvance(advanceData: any) {
  try {
    if (isDemoMode) {
      // Return mock data for demo mode
      const employee = mockEmployees.find((emp) => emp.id === advanceData.employeeId)
      return {
        id: `adv-${Date.now()}`,
        ...advanceData,
        employeeName: employee ? employee.firstName : "Unknown",
        department: employee ? employee.department : "Unknown",
      }
    }

    const advancesRef = collection(db, "advances")

    const docRef = await addDoc(advancesRef, {
      ...advanceData,
      createdAt: serverTimestamp(),
    })

    // Get employee data for the return value
    const employees = await getEmployees()
    const employee = employees.find((emp) => emp.id === advanceData.employeeId)

    return {
      id: docRef.id,
      ...advanceData,
      employeeName: employee ? employee.firstName : "Unknown",
      department: employee ? employee.department : "Unknown",
    }
  } catch (error) {
    console.error("Error adding advance:", error)
    throw error
  }
}

export async function updateAdvance(id: string, advanceData: any) {
  try {
    if (isDemoMode) {
      return true
    }

    const advanceRef = doc(db, "advances", id)

    await updateDoc(advanceRef, {
      ...advanceData,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error("Error updating advance:", error)
    throw error
  }
}

export async function deleteAdvance(id: string) {
  try {
    if (isDemoMode) {
      return true
    }

    const advanceRef = doc(db, "advances", id)

    await deleteDoc(advanceRef)

    return true
  } catch (error) {
    console.error("Error deleting advance:", error)
    throw error
  }
}

export { getEmployeesFirestore as getEmployees }
