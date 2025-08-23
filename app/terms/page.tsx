"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, Users, Shield } from "lucide-react"
import { authService } from "@/lib/auth"

export default function TermsPage() {
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
            <Scale className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardContent className="p-8">
                <p className="text-gray-600 leading-relaxed">
                  Welcome to BlogSink. These Terms of Service ("Terms") govern your use of our platform and services. By
                  accessing or using BlogSink, you agree to be bound by these Terms. If you disagree with any part of
                  these terms, you may not access our service.
                </p>
              </CardContent>
            </Card>

            {/* Acceptance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  By creating an account or using BlogSink, you acknowledge that you have read, understood, and agree to
                  be bound by these Terms and our Privacy Policy. These Terms apply to all users of the service.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  User Accounts and Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
                  <p className="text-gray-600">
                    You must provide accurate and complete information when creating your account. You are responsible
                    for maintaining the security of your account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Account Responsibility</h3>
                  <p className="text-gray-600">
                    You are responsible for all activities that occur under your account. You must notify us immediately
                    of any unauthorized use of your account.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Content Guidelines and Prohibited Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">You agree not to post content that:</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Violates any applicable laws or regulations</li>
                  <li>• Infringes on intellectual property rights</li>
                  <li>• Contains hate speech, harassment, or discriminatory content</li>
                  <li>• Includes spam, malware, or malicious code</li>
                  <li>• Violates privacy rights of others</li>
                  <li>• Contains false or misleading information</li>
                  <li>• Is sexually explicit or inappropriate</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
                  <p className="text-gray-600">
                    You retain ownership of the content you create and publish on BlogSink. By posting content, you
                    grant us a non-exclusive license to display, distribute, and promote your content on our platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Our Platform</h3>
                  <p className="text-gray-600">
                    BlogSink and its original content, features, and functionality are owned by us and are protected by
                    international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Service Availability and Modifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive to provide reliable service but cannot guarantee uninterrupted access. We reserve the right
                  to modify, suspend, or discontinue any part of our service at any time with or without notice.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we
                  believe violates these Terms or is harmful to other users, us, or third parties, or for any other
                  reason.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle>Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  BlogSink is provided "as is" without warranties of any kind. We disclaim all warranties, express or
                  implied, including but not limited to implied warranties of merchantability and fitness for a
                  particular purpose.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  In no event shall BlogSink be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes
                  via email or through our platform. Your continued use of BlogSink after such modifications constitutes
                  acceptance of the updated Terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:legal@blogsink.com" className="text-yellow-600 hover:text-yellow-700">
                    legal@blogsink.com
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
