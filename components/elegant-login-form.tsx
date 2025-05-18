"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { User, Lock, ArrowRight } from "lucide-react"

export function ElegantLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn(email, password)

      if (!result.success) {
        toast({
          title: "Authentication Error",
          description: result.message || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-xl"
    >
      <div className="relative h-32 bg-gradient-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
        </div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white text-2xl font-bold">EM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 px-8 pt-16 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com or john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 py-2 border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="admin123 or john123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 py-2 border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary rounded-lg"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-gradient-primary hover:opacity-90 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Demo credentials:</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="font-medium text-gray-700 dark:text-gray-300">Admin</p>
              <p className="text-gray-500 dark:text-gray-400">admin@example.com</p>
              <p className="text-gray-500 dark:text-gray-400">admin123</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="font-medium text-gray-700 dark:text-gray-300">Employee</p>
              <p className="text-gray-500 dark:text-gray-400">john@example.com</p>
              <p className="text-gray-500 dark:text-gray-400">john123</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
