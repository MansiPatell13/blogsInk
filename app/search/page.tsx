"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Clock, Star } from "lucide-react"
import { blogService, type Blog } from "@/lib/blog"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const allCategories = blogService.getCategories()
    setCategories(allCategories)
  }, [])

  useEffect(() => {
    setIsLoading(true)

    // Simulate search delay
    const searchTimeout = setTimeout(() => {
      let results = blogService.searchBlogs(searchQuery, selectedCategory)

      // Sort results
      if (sortBy === "popular") {
        results = results.sort((a, b) => b.likes - a.likes)
      } else {
        results = results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setFilteredBlogs(results)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery, selectedCategory, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("latest")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Articles</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
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
                  className="flex items-center space-x-1"
                >
                  <Clock className="h-4 w-4" />
                  <span>Latest</span>
                </Button>
                <Button
                  variant={sortBy === "popular" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("popular")}
                  className="flex items-center space-x-1"
                >
                  <Star className="h-4 w-4" />
                  <span>Popular</span>
                </Button>
              </div>

              {(searchQuery || selectedCategory !== "all") && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} found
                  {searchQuery && (
                    <span className="ml-1">
                      for "<span className="font-medium">{searchQuery}</span>"
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-red-600">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <section>
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No articles match your search for "${searchQuery}"`
                  : "Try adjusting your search terms or browse all categories"}
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
