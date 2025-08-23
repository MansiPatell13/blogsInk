"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Library, FileText, BarChart3, PenTool, ChevronLeft, ChevronRight } from "lucide-react"
import { authService, type User } from "@/lib/auth"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Library", href: "/library", icon: Library },
  { name: "Stories", href: "/stories", icon: FileText },
  { name: "Stats", href: "/stats", icon: BarChart3 },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)
  }, [])

  if (!user) return null

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-white z-40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="p-2 border-b">
          <Button variant="ghost" size="sm" onClick={onToggle} className="w-full justify-center hover:bg-yellow-50">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-col h-full p-4">
          {/* Main Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full font-normal",
                      isCollapsed ? "justify-center px-2" : "justify-start text-left",
                      isActive && "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Following Section */}
          {!isCollapsed && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Following</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <PenTool className="h-3 w-3 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">The BlogSink Blog</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Discover more writers and publications to follow.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
