"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, BookOpen, Users, Settings, Shield, MessageCircle } from "lucide-react"
import { authService } from "@/lib/auth"
import { useEffect } from "react"

export default function HelpPage() {
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const helpCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "text-blue-600",
      articles: [
        "How to create your first story",
        "Setting up your profile",
        "Understanding the editor",
        "Publishing your story",
      ],
    },
    {
      title: "Account & Settings",
      icon: Settings,
      color: "text-green-600",
      articles: [
        "Managing your account settings",
        "Changing your password",
        "Privacy settings",
        "Notification preferences",
      ],
    },
    {
      title: "Community",
      icon: Users,
      color: "text-purple-600",
      articles: ["Following other writers", "Engaging with stories", "Community guidelines", "Reporting content"],
    },
    {
      title: "Safety & Security",
      icon: Shield,
      color: "text-red-600",
      articles: [
        "Account security best practices",
        "Two-factor authentication",
        "Reporting abuse",
        "Privacy protection",
      ],
    },
  ]

  const faqItems = [
    {
      question: "How do I start writing on BlogSink?",
      answer:
        "Simply click the 'Write' button in the top navigation after signing in. You can start with a title and begin writing your story using our rich text editor.",
    },
    {
      question: "Can I save drafts of my stories?",
      answer:
        "Yes! Your stories are automatically saved as drafts. You can access them from your Stories page and publish them when you're ready.",
    },
    {
      question: "How do I add tags to my stories?",
      answer:
        "When you click 'Publish', you'll be prompted to add 3-7 tags that describe your content. Tags help readers discover your stories.",
    },
    {
      question: "Can I edit my story after publishing?",
      answer:
        "Yes, you can edit your published stories at any time. Go to your Stories page and click the edit button next to any story.",
    },
    {
      question: "How do I follow other writers?",
      answer:
        "You can follow writers by visiting their profile pages and clicking the 'Follow' button. You'll see their latest stories in your feed.",
    },
    {
      question: "What should I do if I see inappropriate content?",
      answer:
        "Please report any inappropriate content using the report button. Our moderation team will review it promptly.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />}

      <main className={`transition-all duration-300 ${user ? (sidebarCollapsed ? "ml-16" : "ml-64") : ""} p-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-12 w-12 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
            <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get support</p>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {helpCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.articles.map((article, index) => (
                        <button
                          key={index}
                          className="block w-full text-left text-sm text-gray-600 hover:text-yellow-600 py-1"
                        >
                          {article}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to the most common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-yellow-500" />
                Still need help?
              </CardTitle>
              <CardDescription>Can't find what you're looking for? Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Contact Support</Button>
                <Button variant="outline">Join Community Forum</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
