"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Shield,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Trash2,
  UserX,
  Calendar,
  Heart,
  MessageCircle,
  Activity,
  BarChart3,
} from "lucide-react"
import { blogService, type Blog } from "@/lib/blog"
import { authService, type User } from "@/lib/auth"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [allBlogs, setAllBlogs] = useState<Blog[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
    thisMonthBlogs: 0,
    thisMonthUsers: 0,
    avgLikesPerBlog: 0,
    topAuthor: null as User | null,
    mostLikedBlog: null as Blog | null,
  })

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    if (!authToken || authToken.user.role !== "admin") {
      router.push("/")
      return
    }

    setCurrentUser(authToken.user)

    // Load all data
    const blogs = blogService.getAllBlogs()
    const users = authService.getAllUsers()

    setAllBlogs(blogs)
    setAllUsers(users)

    // Calculate comprehensive stats
    const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
    const totalComments = blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0)
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)
    const publishedBlogs = blogs.filter((blog) => blog.published)
    const draftBlogs = blogs.filter((blog) => !blog.published)
    const adminUsers = users.filter((user) => user.role === "admin")
    const regularUsers = users.filter((user) => user.role === "user")

    // This month stats (mock calculation)
    const thisMonth = new Date()
    thisMonth.setMonth(thisMonth.getMonth() - 1)
    const thisMonthBlogs = blogs.filter((blog) => new Date(blog.createdAt) > thisMonth).length
    const thisMonthUsers = users.filter((user) => new Date(user.createdAt) > thisMonth).length

    // Find top author and most liked blog
    const authorStats = users.map((user) => ({
      user,
      blogCount: blogs.filter((blog) => blog.authorId === user.id).length,
    }))
    const topAuthor =
      authorStats.reduce((prev, current) => (prev.blogCount > current.blogCount ? prev : current))?.user || null

    const mostLikedBlog =
      blogs.reduce((prev, current) => ((prev?.likes || 0) > (current?.likes || 0) ? prev : current)) || null

    setStats({
      totalBlogs: blogs.length,
      publishedBlogs: publishedBlogs.length,
      draftBlogs: draftBlogs.length,
      totalUsers: users.length,
      adminUsers: adminUsers.length,
      regularUsers: regularUsers.length,
      totalLikes,
      totalComments,
      totalViews,
      thisMonthBlogs,
      thisMonthUsers,
      avgLikesPerBlog: blogs.length > 0 ? Math.round(totalLikes / blogs.length) : 0,
      topAuthor,
      mostLikedBlog,
    })
  }, [router])

  const handleDeleteBlog = (blogId: string) => {
    blogService.deleteBlog(blogId)
    const updatedBlogs = allBlogs.filter((blog) => blog.id !== blogId)
    setAllBlogs(updatedBlogs)
    // Recalculate stats would go here
  }

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = allUsers.filter((user) => user.id !== userId)
    setAllUsers(updatedUsers)

    const userBlogs = allBlogs.filter((blog) => blog.authorId === userId)
    userBlogs.forEach((blog) => blogService.deleteBlog(blog.id))

    const updatedBlogs = allBlogs.filter((blog) => blog.authorId !== userId)
    setAllBlogs(updatedBlogs)
    // Recalculate stats would go here
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"} p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="h-8 w-8 text-yellow-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">Monitor platform performance and manage content</p>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Articles</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
                    <p className="text-xs text-green-600 mt-1">+{stats.thisMonthBlogs} this month</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-xs text-green-600 mt-1">+{stats.thisMonthUsers} this month</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes + stats.totalComments}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.totalLikes} likes, {stats.totalComments} comments
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Avg {stats.avgLikesPerBlog} likes/article</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Content Status</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Published</span>
                        <span className="font-medium">{stats.publishedBlogs}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Drafts</span>
                        <span className="font-medium">{stats.draftBlogs}</span>
                      </div>
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">User Roles</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Admins</span>
                        <span className="font-medium">{stats.adminUsers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Users</span>
                        <span className="font-medium">{stats.regularUsers}</span>
                      </div>
                    </div>
                  </div>
                  <Shield className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Platform Health</p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">All Systems Operational</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  Top Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topAuthor ? (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={stats.topAuthor.avatar || "/placeholder.svg"} alt={stats.topAuthor.name} />
                      <AvatarFallback>{stats.topAuthor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{stats.topAuthor.name}</p>
                      <p className="text-sm text-gray-500">
                        {allBlogs.filter((b) => b.authorId === stats.topAuthor?.id).length} articles published
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No authors yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Most Liked Article
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.mostLikedBlog ? (
                  <div>
                    <Link href={`/blog/${stats.mostLikedBlog.id}`} className="hover:text-yellow-600">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{stats.mostLikedBlog.title}</h3>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {stats.mostLikedBlog.likes} likes
                      </span>
                      <span>by {stats.mostLikedBlog.authorName}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No articles yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="blogs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="blogs">Manage Articles</TabsTrigger>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
            </TabsList>

            {/* Articles Management */}
            <TabsContent value="blogs">
              <Card>
                <CardHeader>
                  <CardTitle>All Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Article</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Engagement</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allBlogs.map((blog) => (
                          <TableRow key={blog.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium text-gray-900 line-clamp-1">{blog.title}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {blog.category}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={blog.authorAvatar || "/placeholder.svg"} alt={blog.authorName} />
                                  <AvatarFallback>{blog.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{blog.authorName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={blog.published ? "default" : "secondary"}>
                                {blog.published ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{blog.likes || 0}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{blog.comments?.length || 0}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(blog.createdAt)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Link href={`/blog/${blog.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 bg-transparent"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Article</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteBlog(blog.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {allBlogs.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No articles found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Articles</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers.map((user) => {
                          const userBlogCount = allBlogs.filter((blog) => blog.authorId === user.id).length
                          return (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    {user.bio && <p className="text-xs text-gray-400 line-clamp-1">{user.bio}</p>}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.role === "admin" ? "default" : "secondary"}
                                  className={user.role === "admin" ? "bg-yellow-500 text-black" : ""}
                                >
                                  {user.role === "admin" ? "Admin" : "User"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">{userBlogCount} articles</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(user.createdAt)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {user.role !== "admin" && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 bg-transparent"
                                      >
                                        <UserX className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete {user.name}'s account? This will also delete
                                          all their articles. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteUser(user.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete Account
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {allUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
