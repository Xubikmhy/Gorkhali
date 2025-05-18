import { ElegantLoginForm } from "@/components/elegant-login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <ElegantLoginForm />
      </div>
    </div>
  )
}
