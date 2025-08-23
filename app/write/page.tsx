"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MediaInsertionMenu } from "@/components/editor/media-insertion-menu"
import { PublishModal } from "@/components/publish/publish-modal"
import { Sidebar } from "@/components/layout/sidebar"
import { blogService } from "@/lib/blog"
import { authService } from "@/lib/auth"
import { Droplets } from "lucide-react"

export default function WritePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser())

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [titleHovered, setTitleHovered] = useState(false)
  const [contentHovered, setContentHovered] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth")
      return
    }

    if (editId) {
      const blog = blogService.getBlogById(editId)
      if (blog && (blog.authorId === currentUser.user.id || currentUser.user.role === "admin")) {
        setTitle(blog.title)
        setContent(blog.content)
      } else {
        router.push("/")
      }
    }
  }, [editId, currentUser, router])

  const handlePublishClick = () => {
    if (!currentUser || !title.trim() || !content.trim()) return
    setShowPublishModal(true)
  }

  const handlePublishWithTags = async (tags: string[]) => {
    if (!currentUser || !title.trim() || !content.trim()) return

    setIsLoading(true)

    try {
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: content.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
        authorId: currentUser.user.id,
        authorName: currentUser.user.name,
        authorAvatar: currentUser.user.avatar || "/placeholder.svg",
        category: "Technology",
        tags: tags,
        published: true,
      }

      if (editId) {
        blogService.updateBlog(editId, blogData)
      } else {
        blogService.createBlog(blogData)
      }

      setShowPublishModal(false)
      router.push("/profile")
    } catch (error) {
      console.error("Failed to save blog:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMediaInsert = (type: string, content?: string) => {
    if (content) {
      setContent((prev) => prev + "\n\n" + content + "\n\n")
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Droplets className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl font-bold text-black">BlogSink</h1>
            </Link>
            <span className="text-gray-500 text-sm">Draft in {currentUser.user.name}</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePublishClick}
              disabled={isLoading || !title.trim() || !content.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full text-sm font-medium"
            >
              Publish
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.user.avatar || "/placeholder.svg"} alt={currentUser.user.name} />
              <AvatarFallback className="text-sm bg-yellow-100 text-yellow-700">
                {currentUser.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {currentUser && <Sidebar />}

      <main className={`max-w-4xl mx-auto px-6 py-12 ${currentUser ? "ml-64" : ""}`}>
        <div className="space-y-8">
          {/* Title Section with Hover Plus Icon */}
          <div
            className="flex items-center space-x-4 group"
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            <div className={`transition-opacity duration-200 ${titleHovered ? "opacity-100" : "opacity-0"}`}>
              <MediaInsertionMenu onInsert={handleMediaInsert} />
            </div>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-4xl font-bold text-black placeholder-gray-400 border-none outline-none bg-transparent"
            />
          </div>

          {/* Content Section with Hover Plus Icon */}
          <div
            className="flex items-start space-x-4 group"
            onMouseEnter={() => setContentHovered(true)}
            onMouseLeave={() => setContentHovered(false)}
          >
            <div className={`transition-opacity duration-200 mt-2 ${contentHovered ? "opacity-100" : "opacity-0"}`}>
              <MediaInsertionMenu onInsert={handleMediaInsert} />
            </div>

            <textarea
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-96 text-xl text-gray-700 placeholder-gray-400 border-none outline-none resize-none bg-transparent leading-relaxed"
            />
          </div>
        </div>
      </main>

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublishWithTags}
        isLoading={isLoading}
      />
    </div>
  )
}
