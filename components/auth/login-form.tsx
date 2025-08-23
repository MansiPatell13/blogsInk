"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Github, Mail } from "lucide-react"

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
  onForgotPassword?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await authService.login(email, password)
      if (result) {
        onSuccess?.()
        window.location.href = "/"
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await authService.socialLogin("google", "user@gmail.com", "Google User")
      if (result) {
        onSuccess?.()
        window.location.href = "/"
      }
    } catch (err) {
      setError("Google login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)
    try {
      const result = await authService.socialLogin("github", "user@github.com", "GitHub User")
      if (result) {
        onSuccess?.()
        window.location.href = "/"
      }
    } catch (err) {
      setError("GitHub login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleGithubLogin}
            disabled={isLoading}
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {"Don't have an account? "}
            <button onClick={onSwitchToRegister} className="text-yellow-600 hover:text-yellow-500 font-medium">
              Sign up
            </button>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <button onClick={onForgotPassword} className="text-yellow-600 hover:text-yellow-500 font-medium">
              Forgot your password?
            </button>
          </p>
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            <p>
              <strong>Demo Credentials:</strong>
            </p>
            <p>Admin: admin@blog.com / password123</p>
            <p>User: john@example.com / password123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
