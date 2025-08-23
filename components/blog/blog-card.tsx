import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar } from "lucide-react"
import type { Blog } from "@/lib/blog"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${blog.id}`}>
        <div className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={blog.authorAvatar || "/placeholder.svg"} alt={blog.authorName} />
              <AvatarFallback>{blog.authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{blog.authorName}</span>
              <span>·</span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 line-clamp-3 leading-relaxed">{blog.excerpt}</p>

              {/* Tags and Engagement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {blog.category}
                  </Badge>
                  {blog.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{blog.likes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.imageUrl && (
              <div className="w-32 h-24 flex-shrink-0">
                <Image
                  src={blog.imageUrl || "/placeholder.svg"}
                  alt={blog.title}
                  width={128}
                  height={96}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
