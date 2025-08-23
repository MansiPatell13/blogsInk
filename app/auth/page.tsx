"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login")
  const router = useRouter()

  const handleAuthSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {authMode === "login" && (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setAuthMode("register")}
            onForgotPassword={() => setAuthMode("forgot")}
          />
        )}
        {authMode === "register" && (
          <RegisterForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthMode("login")} />
        )}
        {authMode === "forgot" && <ForgotPasswordForm onBackToLogin={() => setAuthMode("login")} />}
      </div>
    </div>
  )
}
