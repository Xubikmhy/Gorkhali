import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { appTheme } from "@/lib/theme"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Employee Management",
  description: "Simplified Employee Management Application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add SF Pro font from Apple CDN */}
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/sf-pro-display" />
      </head>
      <body className={`font-sans ${inter.variable}`} style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          theme={appTheme}
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
