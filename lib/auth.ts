// JWT-like authentication utilities for the blogging platform
export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  avatar?: string
  bio?: string
  createdAt: string
}

export interface AuthToken {
  user: User
  token: string
  expiresAt: number
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@blog.com",
    name: "Admin User",
    role: "admin",
    avatar: "/admin-avatar.png",
    bio: "Platform administrator",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "john@example.com",
    name: "John Doe",
    role: "user",
    avatar: "/diverse-user-avatars.png",
    bio: "Passionate writer and tech enthusiast",
    createdAt: "2024-01-15T00:00:00Z",
  },
]

export const authService = {
  login: async (email: string, password: string): Promise<AuthToken | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers.find((u) => u.email === email)
    if (!user) return null

    // Simple password check (in real app, this would be hashed)
    if (password !== "password123") return null

    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }))
    const authToken: AuthToken = {
      user,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    localStorage.setItem("authToken", JSON.stringify(authToken))
    return authToken
  },

  register: async (email: string, password: string, name: string): Promise<AuthToken | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "user",
      avatar: "/abstract-user-avatar.png",
      bio: "",
      createdAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    const token = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }))
    const authToken: AuthToken = {
      user: newUser,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }

    localStorage.setItem("authToken", JSON.stringify(authToken))
    return authToken
  },

  logout: () => {
    localStorage.removeItem("authToken")
  },

  getCurrentUser: (): AuthToken | null => {
    const stored = localStorage.getItem("authToken")
    if (!stored) return null

    try {
      const authToken: AuthToken = JSON.parse(stored)
      if (authToken.expiresAt < Date.now()) {
        localStorage.removeItem("authToken")
        return null
      }
      return authToken
    } catch {
      return null
    }
  },

  getAllUsers: (): User[] => {
    return mockUsers
  },

  socialLogin: async (provider: "google" | "github", email: string, name: string): Promise<AuthToken | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user exists, if not create new user
    let user = mockUsers.find((u) => u.email === email)
    if (!user) {
      user = {
        id: Date.now().toString(),
        email,
        name,
        role: "user",
        avatar: provider === "google" ? "/google-avatar.png" : "/github-avatar.png",
        bio: `Joined via ${provider}`,
        createdAt: new Date().toISOString(),
      }
      mockUsers.push(user)
    }

    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }))
    const authToken: AuthToken = {
      user,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }

    localStorage.setItem("authToken", JSON.stringify(authToken))
    return authToken
  },
}
