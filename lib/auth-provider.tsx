"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Define user type
type User = {
  id: string
  displayName: string
  email: string
  role: "admin" | "employee"
  department?: string
}

// Mock users for demo
const MOCK_USERS = [
  {
    id: "admin-1",
    displayName: "Admin User",
    email: "admin@example.com",
    role: "admin" as const,
  },
  {
    id: "emp-1",
    displayName: "John Doe",
    email: "john@example.com",
    role: "employee" as const,
    department: "Design",
  },
]

// Auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signOut: () => void
}

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        // Check local storage for user session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to restore session:", error)
      } finally {
        setLoading(false)
      }
    }

    // Only run in browser environment
    if (typeof window !== "undefined") {
      checkSession()
    } else {
      setLoading(false)
    }
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Simple mock authentication
      const user = MOCK_USERS.find((u) => u.email === email)

      if (!user) {
        return { success: false, message: "Invalid email or password" }
      }

      // Simple password check (in a real app, you'd use proper auth)
      const isValidPassword = password === (user.role === "admin" ? "admin123" : "john123")

      if (!isValidPassword) {
        return { success: false, message: "Invalid email or password" }
      }

      // Set user in state and localStorage
      setUser(user)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user))
      }

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/employee/dashboard")
      }

      return { success: true }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, message: "An error occurred during sign in" }
    }
  }

  // Sign out function
  const signOut = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
