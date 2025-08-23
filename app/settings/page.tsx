"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/sidebar"
import { authService, type User } from "@/lib/auth"
import { Edit, Shield, Bell, CreditCard } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("Account")
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    bio: "",
    digestFrequency: "Daily",
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    newFollowers: true,
    comments: true,
    likes: true,
    mentions: true,
    twoFactorEnabled: false,
    profileVisibility: "public",
    allowComments: true,
    showEmail: false,
  })

  useEffect(() => {
    const authToken = authService.getCurrentUser()
    if (!authToken) {
      router.push("/auth")
      return
    }

    setCurrentUser(authToken.user)
    setFormData({
      email: authToken.user.email,
      username: authToken.user.email.split("@")[0],
      name: authToken.user.name,
      bio: authToken.user.bio || "",
      digestFrequency: "Daily",
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      newFollowers: true,
      comments: true,
      likes: true,
      mentions: true,
      twoFactorEnabled: false,
      profileVisibility: "public",
      allowComments: true,
      showEmail: false,
    })
  }, [router])

  const handleSave = () => {
    if (!currentUser) return
    // In a real app, this would save to backend
    console.log("Settings saved:", formData)
  }

  if (!currentUser) {
    return null
  }

  const tabs = ["Account", "Publishing", "Notifications", "Membership and payment", "Security and apps"]

  const helpArticles = [
    "Sign in or sign up to BlogSink",
    "Your profile page",
    "Writing and publishing your first story",
    "About BlogSink's distribution system",
    "Get started with the Partner Program",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="ml-64 flex">
        <main className="flex-1 max-w-4xl p-8 pr-0">
          <h1 className="text-4xl font-bold text-black mb-8">Settings</h1>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "border-yellow-500 text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Account Tab Content */}
          {activeTab === "Account" && (
            <div className="space-y-8 max-w-2xl pr-8">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email address</Label>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-gray-900">{formData.email}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Username and subdomain</Label>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-gray-900">@{formData.username}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Profile information</Label>
                  <p className="text-sm text-gray-500 mb-4">Edit your photo, name, pronouns, short bio, etc.</p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                        <AvatarFallback className="bg-yellow-100 text-yellow-700">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="mb-2"
                        />
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Short bio"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Your BlogSink Digest frequency</Label>
                  <p className="text-sm text-gray-500 mb-4">Adjust how often you see a new Digest.</p>
                  <Select
                    value={formData.digestFrequency}
                    onValueChange={(value) => setFormData({ ...formData, digestFrequency: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "Publishing" && (
            <div className="space-y-8 max-w-2xl pr-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Publishing Settings
                  </CardTitle>
                  <CardDescription>Configure how your stories are published and displayed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Allow comments on stories</Label>
                      <p className="text-sm text-gray-500">Let readers comment on your published stories</p>
                    </div>
                    <Switch
                      checked={formData.allowComments}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowComments: checked })}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Profile visibility</Label>
                    <Select
                      value={formData.profileVisibility}
                      onValueChange={(value) => setFormData({ ...formData, profileVisibility: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show email on profile</Label>
                      <p className="text-sm text-gray-500">Display your email address on your public profile</p>
                    </div>
                    <Switch
                      checked={formData.showEmail}
                      onCheckedChange={(checked) => setFormData({ ...formData, showEmail: checked })}
                    />
                  </div>

                  <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Save Publishing Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-8 max-w-2xl pr-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Email notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Push notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={formData.pushNotifications}
                      onCheckedChange={(checked) => setFormData({ ...formData, pushNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Weekly digest</Label>
                      <p className="text-sm text-gray-500">Get a weekly summary of activity</p>
                    </div>
                    <Switch
                      checked={formData.weeklyDigest}
                      onCheckedChange={(checked) => setFormData({ ...formData, weeklyDigest: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">New followers</Label>
                      <p className="text-sm text-gray-500">When someone follows you</p>
                    </div>
                    <Switch
                      checked={formData.newFollowers}
                      onCheckedChange={(checked) => setFormData({ ...formData, newFollowers: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Comments</Label>
                      <p className="text-sm text-gray-500">When someone comments on your stories</p>
                    </div>
                    <Switch
                      checked={formData.comments}
                      onCheckedChange={(checked) => setFormData({ ...formData, comments: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Likes</Label>
                      <p className="text-sm text-gray-500">When someone likes your stories</p>
                    </div>
                    <Switch
                      checked={formData.likes}
                      onCheckedChange={(checked) => setFormData({ ...formData, likes: checked })}
                    />
                  </div>

                  <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "Membership and payment" && (
            <div className="space-y-8 max-w-2xl pr-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Membership & Billing
                  </CardTitle>
                  <CardDescription>Manage your BlogSink membership and payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800 mb-2">Free Plan</h3>
                    <p className="text-sm text-yellow-700">You're currently on the free plan</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Upgrade to Premium</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Unlimited story publishing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Advanced analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Custom domain support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Priority support</span>
                      </div>
                    </div>
                    <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                      Upgrade to Premium - $9/month
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Payment Methods</h3>
                    <p className="text-sm text-gray-500 mb-4">No payment methods added</p>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "Security and apps" && (
            <div className="space-y-8 max-w-2xl pr-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and connected applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Change Password</Label>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Two-factor authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={formData.twoFactorEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, twoFactorEnabled: checked })}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Connected Apps</Label>
                    <p className="text-sm text-gray-500 mb-4">No connected applications</p>
                    <Button variant="outline">Manage Connected Apps</Button>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Account Data</Label>
                    <div className="space-y-2">
                      <Button variant="outline">Download Your Data</Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        Delete Account
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <aside className="w-80 p-8 border-l border-gray-200 h-screen overflow-y-auto">
          <div>
            <h3 className="font-semibold text-black mb-4">Suggested help articles</h3>
            <div className="space-y-3">
              {helpArticles.map((article, index) => (
                <Link key={index} href="#" className="block text-sm text-gray-600 hover:text-yellow-600">
                  {article}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <Link href="/help" className="hover:text-yellow-600">
                  Help
                </Link>
                <Link href="/status" className="hover:text-yellow-600">
                  Status
                </Link>
                <Link href="/about" className="hover:text-yellow-600">
                  About
                </Link>
                <Link href="/privacy" className="hover:text-yellow-600">
                  Privacy
                </Link>
                <Link href="/rules" className="hover:text-yellow-600">
                  Rules
                </Link>
                <Link href="/terms" className="hover:text-yellow-600">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
