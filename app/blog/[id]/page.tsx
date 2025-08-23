"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Calendar, Edit, Trash2, ArrowLeft } from "lucide-react"
import { blogService, type Blog, type Comment } from "@/lib/blog"
import { authService } from "@/lib/auth"
import Link from "next/link"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser())

  useEffect(() => {
    if (params.id) {
      const blogData = blogService.getBlogById(params.id as string)
      if (blogData) {
        setBlog(blogData)
        setComments(blogService.getCommentsByBlog(params.id as string))
        setIsLiked(currentUser ? blogData.likedBy.includes(currentUser.user.id) : false)
      }
    }
  }, [params.id, currentUser])

  const handleLike = () => {
    if (!currentUser || !blog) return

    const updatedBlog = blogService.likeBlog(blog.id, currentUser.user.id)
    if (updatedBlog) {
      setBlog(updatedBlog)
      setIsLiked(updatedBlog.likedBy.includes(currentUser.user.id))
    }
  }

  const handleComment = () => {
    if (!currentUser || !blog || !newComment.trim()) return

    const comment = blogService.addComment({
      blogId: blog.id,
      authorId: currentUser.user.id,
      authorName: currentUser.user.name,
      authorAvatar: currentUser.user.avatar || "/placeholder.svg",
      content: newComment.trim(),
    })

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleDelete = () => {
    if (!blog || !currentUser) return

    if (confirm("Are you sure you want to delete this blog post?")) {
      blogService.deleteBlog(blog.id)
      router.push("/profile")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const canEdit = currentUser && (currentUser.user.id === blog.authorId || currentUser.user.role === "admin")

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{blog.title}</h1>

          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={blog.authorAvatar || "/placeholder.svg"} alt={blog.authorName} />
                <AvatarFallback>{blog.authorName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{blog.authorName}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Edit/Delete Actions */}
            {canEdit && (
              <div className="flex items-center space-x-2">
                <Link href={`/write?edit=${blog.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center space-x-2 mb-6">
            <Badge variant="secondary">{blog.category}</Badge>
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="mb-8">
            <img
              src={blog.imageUrl || "/placeholder.svg"}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Engagement Actions */}
        <div className="flex items-center space-x-6 py-6 border-t border-b border-gray-200 mb-8">
          <Button
            variant={isLiked ? "default" : "outline"}
            onClick={handleLike}
            disabled={!currentUser}
            className="flex items-center space-x-2"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{blog.likes}</span>
          </Button>

          <div className="flex items-center space-x-2 text-gray-600">
            <MessageCircle className="h-4 w-4" />
            <span>{comments.length} comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Comments ({comments.length})</h3>

          {/* Add Comment */}
          {currentUser ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">Sign in to join the conversation</p>
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.authorName} />
                  <AvatarFallback>{comment.authorName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-medium text-gray-900">{comment.authorName}</p>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
