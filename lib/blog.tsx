// Blog management utilities
export interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  authorName: string
  authorAvatar: string
  category: string
  tags: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
  likes: number
  likedBy: string[]
  published: boolean
}

export interface Comment {
  id: string
  blogId: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  createdAt: string
}

// Mock blog data
const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    content:
      "<h2>Introduction</h2><p>React and TypeScript make a powerful combination for building modern web applications. In this comprehensive guide, we'll explore how to set up and use these technologies together.</p><h3>Why TypeScript?</h3><p>TypeScript provides static type checking, which helps catch errors early in development and improves code maintainability.</p>",
    excerpt: "Learn how to combine React and TypeScript for better development experience and type safety.",
    authorId: "2",
    authorName: "John Doe",
    authorAvatar: "/diverse-user-avatars.png",
    category: "Technology",
    tags: ["React", "TypeScript", "Web Development"],
    imageUrl: "/react-typescript-coding.png",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    likes: 15,
    likedBy: ["1"],
    published: true,
  },
  {
    id: "2",
    title: "The Future of Web Development",
    content:
      "<h2>Emerging Trends</h2><p>Web development is constantly evolving. Let's explore the latest trends and technologies shaping the future of web development.</p><h3>Key Technologies</h3><ul><li>Server Components</li><li>Edge Computing</li><li>AI Integration</li></ul>",
    excerpt: "Explore the emerging trends and technologies that are shaping the future of web development.",
    authorId: "2",
    authorName: "John Doe",
    authorAvatar: "/diverse-user-avatars.png",
    category: "Technology",
    tags: ["Web Development", "Future Tech", "Trends"],
    imageUrl: "/future-web-development.png",
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
    likes: 23,
    likedBy: ["1"],
    published: true,
  },
]

const mockComments: Comment[] = [
  {
    id: "1",
    blogId: "1",
    authorId: "1",
    authorName: "Admin User",
    authorAvatar: "/admin-avatar.png",
    content: "Great article! Very helpful for beginners.",
    createdAt: "2024-01-20T12:00:00Z",
  },
]

export const blogService = {
  getAllBlogs: (): Blog[] => {
    return mockBlogs
      .filter((blog) => blog.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getBlogById: (id: string): Blog | null => {
    return mockBlogs.find((blog) => blog.id === id) || null
  },

  getBlogsByAuthor: (authorId: string): Blog[] => {
    return mockBlogs.filter((blog) => blog.authorId === authorId)
  },

  createBlog: (blogData: Omit<Blog, "id" | "createdAt" | "updatedAt" | "likes" | "likedBy">): Blog => {
    const newBlog: Blog = {
      ...blogData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    }
    mockBlogs.push(newBlog)
    return newBlog
  },

  updateBlog: (id: string, updates: Partial<Blog>): Blog | null => {
    const index = mockBlogs.findIndex((blog) => blog.id === id)
    if (index === -1) return null

    mockBlogs[index] = {
      ...mockBlogs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return mockBlogs[index]
  },

  deleteBlog: (id: string): boolean => {
    const index = mockBlogs.findIndex((blog) => blog.id === id)
    if (index === -1) return false

    mockBlogs.splice(index, 1)
    return true
  },

  likeBlog: (blogId: string, userId: string): Blog | null => {
    const blog = mockBlogs.find((b) => b.id === blogId)
    if (!blog) return null

    if (blog.likedBy.includes(userId)) {
      // Unlike
      blog.likedBy = blog.likedBy.filter((id) => id !== userId)
      blog.likes = Math.max(0, blog.likes - 1)
    } else {
      // Like
      blog.likedBy.push(userId)
      blog.likes += 1
    }

    return blog
  },

  searchBlogs: (query: string, category?: string): Blog[] => {
    let results = mockBlogs.filter((blog) => blog.published)

    if (query) {
      const searchTerm = query.toLowerCase()
      results = results.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.excerpt.toLowerCase().includes(searchTerm) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      )
    }

    if (category && category !== "all") {
      results = results.filter((blog) => blog.category === category)
    }

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  getCategories: (): string[] => {
    const categories = [...new Set(mockBlogs.map((blog) => blog.category))]
    return categories
  },

  // Comments
  getCommentsByBlog: (blogId: string): Comment[] => {
    return mockComments
      .filter((comment) => comment.blogId === blogId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  addComment: (commentData: Omit<Comment, "id" | "createdAt">): Comment => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    mockComments.push(newComment)
    return newComment
  },

  deleteComment: (id: string): boolean => {
    const index = mockComments.findIndex((comment) => comment.id === id)
    if (index === -1) return false

    mockComments.splice(index, 1)
    return true
  },
}
