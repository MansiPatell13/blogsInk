"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Feather, Users, Globe, Heart, Target, Lightbulb, Shield } from "lucide-react"
import { authService } from "@/lib/auth"
import Link from "next/link"

export default function AboutPage() {
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const values = [
    {
      icon: Feather,
      title: "Creative Expression",
      description: "We believe everyone has a story worth telling and deserve the tools to tell it beautifully.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building meaningful connections between writers and readers through thoughtful engagement.",
    },
    {
      icon: Globe,
      title: "Open Platform",
      description: "Accessible to all voices, fostering diverse perspectives and inclusive conversations.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Maintaining a safe, respectful environment where creativity can flourish.",
    },
  ]

  const stats = [
    { label: "Active Writers", value: "10K+" },
    { label: "Stories Published", value: "50K+" },
    { label: "Monthly Readers", value: "1M+" },
    { label: "Countries", value: "150+" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />}

      <main className={`transition-all duration-300 ${user ? (sidebarCollapsed ? "ml-16" : "ml-64") : ""} p-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Feather className="h-16 w-16 text-yellow-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About BlogSink</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              BlogSink is where stories come to life. We're building a platform that empowers writers to share their
              ideas, connect with readers, and build meaningful communities around the art of storytelling.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="text-center">
                <Target className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To democratize publishing and create a space where every voice matters. We believe that great stories
                  have the power to inspire, educate, and bring people together across all boundaries.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                          <p className="text-gray-600">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Stats Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">BlogSink by the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Story Section */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Lightbulb className="h-12 w-12 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="mb-4">
                  BlogSink was born from a simple observation: the best stories often go untold. In a world filled with
                  noise, we wanted to create a signal—a place where thoughtful writing could find its audience and where
                  readers could discover content that truly matters to them.
                </p>
                <p className="mb-4">
                  Founded in 2024, we started with the belief that everyone has something valuable to share. Whether
                  you're a seasoned writer or just starting your journey, BlogSink provides the tools and community you
                  need to tell your story effectively.
                </p>
                <p>
                  Today, we're proud to host thousands of writers from around the world, each contributing their unique
                  perspective to our growing library of human knowledge and experience.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
              <p className="text-lg text-gray-600 mb-6">
                Ready to share your story with the world? Join thousands of writers who call BlogSink home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3">Start Writing</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="px-8 py-3 bg-transparent">
                    Explore Stories
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
