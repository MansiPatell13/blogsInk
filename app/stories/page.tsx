"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { authService } from "@/lib/auth"
import { blogService } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Heart, MessageCircle, MoreHorizontal, Edit, Trash2, PenTool } from "lucide-react"

export default function StoriesPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser())
  const [userBlogs, setUserBlogs] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all")

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth")
      return
    }

    const blogs = blogService.getAllBlogs().filter((blog) => blog.authorId === currentUser.user.id)
    setUserBlogs(blogs)
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const filteredBlogs = userBlogs.filter((blog) => {
    if (filter === "published") return blog.published
    if (filter === "drafts") return !blog.published
    return true
  })

  const handleDelete = (blogId: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      blogService.deleteBlog(blogId)
      setUserBlogs(userBlogs.filter((blog) => blog.id !== blogId))
    }
  }

  const publishedCount = userBlogs.filter((blog) => blog.published).length
  const draftCount = userBlogs.filter((blog) => !blog.published).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Stories</h1>
              <p className="text-gray-600">Manage and track your published content</p>
            </div>
            <Link href="/write">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <PenTool className="h-4 w-4 mr-2" />
                Write Story
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
            >
              All ({userBlogs.length})
            </Button>
            <Button
              variant={filter === "published" ? "default" : "ghost"}
              onClick={() => setFilter("published")}
              className={filter === "published" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
            >
              Published ({publishedCount})
            </Button>
            <Button
              variant={filter === "drafts" ? "default" : "ghost"}
              onClick={() => setFilter("drafts")}
              className={filter === "drafts" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
            >
              Drafts ({draftCount})
            </Button>
          </div>

          {/* Stories List */}
          <div className="space-y-4">
            {filteredBlogs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <PenTool className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {filter === "drafts"
                      ? "No drafts"
                      : filter === "published"
                        ? "No published stories"
                        : "No stories yet"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {filter === "drafts"
                      ? "You don't have any draft stories"
                      : filter === "published"
                        ? "You haven't published any stories yet"
                        : "Start writing your first story"}
                  </p>
                  <Link href="/write">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Write Your First Story</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredBlogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={blog.published ? "default" : "secondary"}>
                            {blog.published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{blog.category}</Badge>
                          {blog.tags?.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Link href={blog.published ? `/blog/${blog.id}` : `/write?edit=${blog.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-yellow-600 transition-colors">
                            {blog.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                            {blog.published && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {blog.views || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {blog.likes || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  {blog.comments?.length || 0}
                                </span>
                              </>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/write?edit=${blog.id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(blog.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
