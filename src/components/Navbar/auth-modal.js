"use client"


import { useState } from "react"
import { X, LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"


export default function AuthModal({ isOpen, onClose, initialMode, onModeChange }) {
  const [activeTab, setActiveTab] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Form states
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" })

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    onModeChange(tab)
    setError("")
    setSuccess("")
  }

  const validateLoginForm = () => {
    if (!loginData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!loginData.password) {
      setError("Password is required")
      return false
    }
    return true
  }

  const validateRegisterForm = () => {
    if (!registerData.username.trim()) {
      setError("Username is required")
      return false
    }
    if (registerData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }
    if (!registerData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!registerData.password) {
      setError("Password is required")
      return false
    }
    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateLoginForm()) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (error) throw error

      if (data?.user) {
        setSuccess("Successfully signed in!")
        setTimeout(() => {
          onClose()
          router.push("/")
        }, 1000)
      }
    } catch (error) {
      console.error("Error signing in:", error)
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.")
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please check your email and click the confirmation link before signing in.")
      } else {
        setError(error.message || "An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateRegisterForm()) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            username: registerData.username,
            display_name: registerData.username,
          },
        },
      })

      if (error) throw error

      if (data?.user && !data?.user?.email_confirmed_at) {
        setSuccess("Please check your email and click the confirmation link to complete your registration.")
      } else {
        setSuccess("Account created successfully!")
        setTimeout(() => {
          onClose()
          router.push("/")
        }, 2000)
      }
    } catch (error) {
      console.error("Error signing up:", error)
      if (error.message.includes("User already registered")) {
        setError("An account with this email already exists. Please try signing in instead.")
      } else if (error.message.includes("Password should be at least")) {
        setError("Password should be at least 6 characters long.")
      } else if (error.message.includes("Invalid email")) {
        setError("Please enter a valid email address.")
      } else {
        setError(error.message || "An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative p-6 pb-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === "login" ? (
                  <LogIn className="w-8 h-8 text-white" />
                ) : (
                  <UserPlus className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {activeTab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-400 text-sm">
                {activeTab === "login"
                  ? "Sign in to continue your streaming experience"
                  : "Join us to start your streaming journey"}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-800/50 rounded-lg p-1 mb-6">
              <button
                onClick={() => handleTabChange("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "login"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <LogIn className="w-4 h-4 mr-2 inline" />
                Sign In
              </button>
              <button
                onClick={() => handleTabChange("register")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "register"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <UserPlus className="w-4 h-4 mr-2 inline" />
                Sign Up
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 bg-red-900/20 border-red-800/50 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="mb-4 bg-green-900/20 border-green-800/50 text-green-300">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="register-username" className="text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="register-username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      placeholder="Enter your username"
                      required
                      disabled={isLoading}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
