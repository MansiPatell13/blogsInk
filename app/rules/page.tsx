"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Shield, AlertTriangle, Heart, Flag } from "lucide-react"
import { authService } from "@/lib/auth"

export default function RulesPage() {
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const rules = [
    {
      icon: Heart,
      title: "Be Respectful",
      description:
        "Treat all community members with kindness and respect. Personal attacks, harassment, and discriminatory language are not tolerated.",
      examples: ["Use constructive criticism", "Respect different viewpoints", "Avoid personal insults"],
    },
    {
      icon: BookOpen,
      title: "Create Original Content",
      description:
        "Share your own thoughts, experiences, and insights. Plagiarism and copyright infringement are strictly prohibited.",
      examples: ["Write original stories", "Properly attribute quotes", "Respect intellectual property"],
    },
    {
      icon: Users,
      title: "Foster Community",
      description:
        "Engage meaningfully with other writers and readers. Build connections through thoughtful comments and discussions.",
      examples: ["Leave constructive feedback", "Engage in discussions", "Support fellow writers"],
    },
    {
      icon: Shield,
      title: "Keep It Safe",
      description:
        "Help maintain a safe environment for all users. Report inappropriate content and avoid sharing harmful material.",
      examples: ["Report violations", "Avoid explicit content", "Protect privacy"],
    },
  ]

  const violations = [
    {
      type: "Spam and Self-Promotion",
      severity: "Medium",
      description: "Excessive self-promotion, repetitive content, or irrelevant links",
    },
    {
      type: "Harassment and Abuse",
      severity: "High",
      description: "Personal attacks, threats, doxxing, or targeted harassment",
    },
    {
      type: "Hate Speech",
      severity: "High",
      description: "Content that promotes hatred based on race, religion, gender, or other characteristics",
    },
    {
      type: "Misinformation",
      severity: "Medium",
      description: "Deliberately false or misleading information presented as fact",
    },
    {
      type: "Copyright Infringement",
      severity: "High",
      description: "Using copyrighted material without permission or proper attribution",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />}

      <main className={`transition-all duration-300 ${user ? (sidebarCollapsed ? "ml-16" : "ml-64") : ""} p-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
            <p className="text-lg text-gray-600">
              Our rules help create a welcoming, safe, and inspiring environment for all writers and readers
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-gray-600 leading-relaxed">
                BlogSink is built on the foundation of respectful discourse and creative expression. These guidelines
                help ensure our community remains a place where everyone can share their stories, learn from others, and
                engage in meaningful conversations. By using BlogSink, you agree to follow these rules.
              </p>
            </CardContent>
          </Card>

          {/* Core Rules */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Core Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rules.map((rule, index) => {
                const IconComponent = rule.icon
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-yellow-500" />
                        {rule.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{rule.description}</p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Examples:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rule.examples.map((example, idx) => (
                            <li key={idx}>• {example}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Violations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Common Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {violations.map((violation, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{violation.type}</h3>
                      <p className="text-gray-600 text-sm">{violation.description}</p>
                    </div>
                    <Badge className={getSeverityColor(violation.severity)}>{violation.severity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enforcement */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enforcement and Consequences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We take violations of our community guidelines seriously. Depending on the severity and frequency of
                violations, consequences may include:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Warning and guidance on community standards</li>
                <li>• Temporary restriction of posting privileges</li>
                <li>• Removal of violating content</li>
                <li>• Temporary or permanent account suspension</li>
                <li>• Reporting to relevant authorities for illegal content</li>
              </ul>
              <p className="text-gray-600">
                We believe in education and second chances, but repeated violations or severe misconduct may result in
                permanent removal from the platform.
              </p>
            </CardContent>
          </Card>

          {/* Reporting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-yellow-600" />
                Reporting Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you encounter content or behavior that violates our guidelines, please report it immediately. You can
                report content by:
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• Using the report button on any story or comment</li>
                <li>• Contacting our moderation team directly</li>
                <li>• Emailing us at moderation@blogsink.com</li>
              </ul>
              <p className="text-gray-600">
                All reports are reviewed by our moderation team within 24 hours. We take every report seriously and
                investigate thoroughly while protecting the privacy of all parties involved.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
