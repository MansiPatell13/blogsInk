"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, LogOut, Shield, Menu, Edit3, Feather } from "lucide-react"
import { authService, type User as UserType } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface HeaderProps {
  onSidebarToggle?: () => void
}

export function Header({ onSidebarToggle }: HeaderProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-none">
        <div className="flex items-center space-x-4">
          {user && (
            <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="lg:hidden hover:bg-yellow-50">
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Feather className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-bold text-black">BlogSink</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>
        </form>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/write">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Write</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-yellow-100 text-yellow-700">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/write" className="flex items-center">
                      <Edit3 className="mr-2 h-4 w-4" />
                      <span>Write Article</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="hover:bg-yellow-50 hover:text-yellow-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
