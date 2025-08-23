"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { MoreHorizontal, Bookmark } from "lucide-react"
import { blogService } from "@/lib/blog"
import { authService } from "@/lib/auth"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [userBlogs, setUserBlogs] = useState([])
  const [activeTab, setActiveTab] = useState("Home")

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    if (!authToken) {
      router.push("/auth")
      return
    }

    setCurrentUser(authToken.user)
    const blogs = blogService.getBlogsByAuthor(authToken.user.id)
    setUserBlogs(blogs.filter((blog) => blog.published))
  }, [router])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />

      <div className="ml-64">
        <main className="max-w-4xl mx-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black mb-4">{currentUser.name}</h1>
              <div className="flex items-center space-x-6 text-gray-600">
                <button
                  className={`pb-2 border-b-2 ${activeTab === "Home" ? "border-yellow-500 text-black" : "border-transparent"}`}
                  onClick={() => setActiveTab("Home")}
                >
                  Home
                </button>
                <button
                  className={`pb-2 border-b-2 ${activeTab === "Lists" ? "border-yellow-500 text-black" : "border-transparent"}`}
                  onClick={() => setActiveTab("Lists")}
                >
                  Lists
                </button>
                <button
                  className={`pb-2 border-b-2 ${activeTab === "About" ? "border-yellow-500 text-black" : "border-transparent"}`}
                  onClick={() => setActiveTab("About")}
                >
                  About
                </button>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-8">
              {userBlogs.map((blog) => (
                <article key={blog.id} className="border-b border-gray-200 pb-8">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-8">
                      <Link href={`/blog/${blog.id}`}>
                        <h2 className="text-xl font-bold text-black mb-2 hover:text-gray-700 cursor-pointer line-clamp-2">
                          {blog.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(blog.createdAt)}</span>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 hover:text-yellow-600">
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="hover:text-yellow-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {blog.imageUrl && (
                      <div className="w-32 h-24 flex-shrink-0">
                        <img
                          src={blog.imageUrl || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>

        <aside className="fixed right-0 top-16 w-80 p-8 border-l border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="text-2xl bg-yellow-100 text-yellow-700">
                  {currentUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-black">{currentUser.name}</h3>
              <p className="text-gray-600 text-sm mb-4">1 follower</p>
              <Link href="/settings">
                <Button
                  variant="outline"
                  className="text-yellow-600 border-yellow-500 hover:bg-yellow-50 rounded-full px-6 bg-transparent"
                >
                  Edit profile
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
