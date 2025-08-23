"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { authService } from "@/lib/auth"
import { blogService } from "@/lib/blog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Heart, MessageCircle, Users, TrendingUp, Calendar } from "lucide-react"

export default function StatsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser())
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalFollowers: 0,
    totalStories: 0,
    thisMonthViews: 0,
    thisMonthLikes: 0,
    topStory: null as any,
  })

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth")
      return
    }

    // Calculate user stats
    const userBlogs = blogService.getAllBlogs().filter((blog) => blog.authorId === currentUser.user.id)
    const totalViews = userBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0)
    const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
    const totalComments = userBlogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0)
    const topStory = userBlogs.sort((a, b) => (b.views || 0) - (a.views || 0))[0]

    setStats({
      totalViews,
      totalLikes,
      totalComments,
      totalFollowers: Math.floor(Math.random() * 100) + 10, // Mock data
      totalStories: userBlogs.length,
      thisMonthViews: Math.floor(totalViews * 0.3),
      thisMonthLikes: Math.floor(totalLikes * 0.4),
      topStory,
    })
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const statCards = [
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      description: `+${stats.thisMonthViews} this month`,
      color: "text-blue-600",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      description: `+${stats.thisMonthLikes} this month`,
      color: "text-red-600",
    },
    {
      title: "Total Comments",
      value: stats.totalComments.toLocaleString(),
      icon: MessageCircle,
      description: "Across all stories",
      color: "text-green-600",
    },
    {
      title: "Followers",
      value: stats.totalFollowers.toLocaleString(),
      icon: Users,
      description: "People following you",
      color: "text-purple-600",
    },
    {
      title: "Published Stories",
      value: stats.totalStories.toLocaleString(),
      icon: TrendingUp,
      description: "Total published",
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Stats</h1>
            <p className="text-gray-600">Track your writing performance and engagement</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat) => {
              const IconComponent = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Top Story */}
          {stats.topStory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  Your Top Story
                </CardTitle>
                <CardDescription>Your most viewed story</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.topStory.title}</h3>
                  <p className="text-gray-600 text-sm">{stats.topStory.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {stats.topStory.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {stats.topStory.likes || 0} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(stats.topStory.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
