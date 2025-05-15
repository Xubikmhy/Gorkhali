import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { auth } from "./config"
import { createUserDocument } from "./firestore"

// Sign in function
export async function signIn(username: string, password: string) {
  try {
    // For demo/preview mode without Firebase credentials
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key") {
      console.log("Using demo mode authentication")

      // Mock authentication for demo/preview
      if (username === "admin" && password === "admin123") {
        return { uid: "admin-uid", email: "admin@employeemanagement.com", displayName: "Admin" }
      } else if (password === `${username}@123`) {
        return {
          uid: `${username}-uid`,
          email: `${username.toLowerCase()}@employeemanagement.com`,
          displayName: username,
        }
      } else {
        throw new Error("Invalid credentials")
      }
    }

    // For production with real Firebase
    const email =
      username === "admin" ? "admin@employeemanagement.com" : `${username.toLowerCase()}@employeemanagement.com`

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

// Sign out function
export async function signOut() {
  try {
    await firebaseSignOut(auth)
    return true
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Create a new user (for admin to create employee accounts)
export async function createUser(
  firstName: string,
  department: string,
  phone: string,
  employmentType: "Full-time" | "Part-time",
  salaryType: "Hourly" | "Monthly",
  rate: number,
) {
  try {
    const email = `${firstName.toLowerCase()}@employeemanagement.com`
    const password = `${firstName}@123`

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, {
      displayName: firstName,
    })

    // Create user document in Firestore
    await createUserDocument(user.uid, {
      firstName,
      department,
      phone,
      employmentType,
      salaryType,
      rate,
      status: "Active",
      role: "employee",
    })

    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
