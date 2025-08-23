"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Cookie, Mail } from "lucide-react"
import { authService } from "@/lib/auth"

export default function PrivacyPage() {
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    setUser(authToken?.user || null)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />}

      <main className={`transition-all duration-300 ${user ? (sidebarCollapsed ? "ml-16" : "ml-64") : ""} p-8`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardContent className="p-8">
                <p className="text-gray-600 leading-relaxed">
                  At BlogSink, we take your privacy seriously. This Privacy Policy explains how we collect, use, and
                  protect your personal information when you use our platform. By using BlogSink, you agree to the
                  collection and use of information in accordance with this policy.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-600">
                    When you create an account, we collect your name, email address, and any profile information you
                    choose to provide, such as a bio or profile picture.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content Information</h3>
                  <p className="text-gray-600">
                    We store the stories, comments, and other content you create and publish on our platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <p className="text-gray-600">
                    We collect information about how you use BlogSink, including your reading preferences, engagement
                    patterns, and technical information about your device and browser.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-gray-600">
                  <li>• To provide and maintain our service</li>
                  <li>• To personalize your experience and recommend relevant content</li>
                  <li>• To communicate with you about your account and our services</li>
                  <li>• To improve our platform and develop new features</li>
                  <li>• To ensure the security and integrity of our platform</li>
                  <li>• To comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your
                  consent, except in the following circumstances:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• With your explicit consent</li>
                  <li>• To comply with legal requirements or court orders</li>
                  <li>• To protect our rights, property, or safety, or that of our users</li>
                  <li>
                    • With service providers who assist us in operating our platform (under strict confidentiality)
                  </li>
                  <li>• In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. However, no method of
                  transmission over the internet or electronic storage is 100% secure.
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-yellow-600" />
                  Cookies and Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns,
                  and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">You have the right to:</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Access, update, or delete your personal information</li>
                  <li>• Export your data in a portable format</li>
                  <li>• Opt out of marketing communications</li>
                  <li>• Request restriction of processing</li>
                  <li>• Object to processing based on legitimate interests</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
                  <a href="mailto:privacy@blogsink.com" className="text-yellow-600 hover:text-yellow-700">
                    privacy@blogsink.com
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
