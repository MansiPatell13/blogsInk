"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { authService } from "@/lib/auth"
import { blogService } from "@/lib/blog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Clock, Eye, Heart, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function LibraryPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser())
  const [savedBlogs, setSavedBlogs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth")
      return
    }

    // Mock saved blogs - in real app, this would come from user's saved items
    const allBlogs = blogService.getAllBlogs()
    const mockSavedBlogs = allBlogs.slice(0, 3).map((blog) => ({
      ...blog,
      savedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))
    setSavedBlogs(mockSavedBlogs)
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const filteredBlogs = savedBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || blog.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "technology", "design", "business", "lifestyle"]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Library</h1>
            <p className="text-gray-600">Stories you've saved for later</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your saved stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Saved Stories */}
          <div className="space-y-6">
            {filteredBlogs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved stories</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "No stories match your current filters"
                      : "Start saving stories to read them later"}
                  </p>
                  <Link href="/">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Discover Stories</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredBlogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={blog.authorAvatar || "/placeholder.svg"} alt={blog.authorName} />
                            <AvatarFallback className="text-xs bg-yellow-100 text-yellow-700">
                              {blog.authorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{blog.authorName}</p>
                            <p className="text-xs text-gray-500">Saved {new Date(blog.savedAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <Link href={`/blog/${blog.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-yellow-600 transition-colors">
                            {blog.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {blog.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {blog.likes || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{blog.category}</Badge>
                            <Button variant="ghost" size="sm">
                              <Bookmark className="h-4 w-4 fill-current text-yellow-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
