"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Clock, Star } from "lucide-react"
import { blogService, type Blog } from "@/lib/blog"
import { authService } from "@/lib/auth"

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)

    const allBlogs = blogService.getAllBlogs()
    const allCategories = blogService.getCategories()

    setBlogs(allBlogs)
    setCategories(allCategories)
    setFilteredBlogs(allBlogs)
  }, [])

  useEffect(() => {
    let filtered = blogService.searchBlogs(searchQuery, selectedCategory)

    // Sort blogs
    if (sortBy === "popular") {
      filtered = filtered.sort((a, b) => b.likes - a.likes)
    } else {
      filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredBlogs(filtered)
  }, [searchQuery, selectedCategory, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const featuredBlogs = blogs.slice(0, 3)
  const trendingTags = ["React", "TypeScript", "Web Development", "JavaScript", "Next.js"]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header onSidebarToggle={handleSidebarToggle} />
      {user && <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />}

      <main
        className={`transition-all duration-300 ${
          user ? (sidebarCollapsed ? "ml-16" : "ml-64") : ""
        } px-4 py-8 max-w-none`}
      >
        <div className="max-w-6xl mx-auto">
          <section className="text-center py-16 mb-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
                Stories that <span className="text-yellow-500">inspire</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover thoughtful stories, ideas, and expertise from writers on any topic that matters to you.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Search for articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg border-gray-200 focus:border-yellow-400 focus:ring-yellow-400 w-full"
                  />
                </div>
              </form>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-yellow-500" />
              Trending Topics
            </h2>
            <div className="flex flex-wrap gap-3">
              {trendingTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 transition-colors px-4 py-2 text-sm font-medium border-gray-300"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={sortBy === "latest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("latest")}
                    className={`flex items-center space-x-1 ${
                      sortBy === "latest"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                        : "border-gray-300 hover:bg-yellow-50 hover:text-yellow-700"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Latest</span>
                  </Button>
                  <Button
                    variant={sortBy === "popular" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("popular")}
                    className={`flex items-center space-x-1 ${
                      sortBy === "popular"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                        : "border-gray-300 hover:bg-yellow-50 hover:text-yellow-700"
                    }`}
                  >
                    <Star className="h-4 w-4" />
                    <span>Popular</span>
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4 lg:mt-0">
                {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </section>

          {/* Blog Grid */}
          <section>
            {filteredBlogs.length > 0 ? (
              <div className="space-y-8">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="border-b border-gray-100 pb-8 last:border-b-0">
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-black mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse all categories.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
