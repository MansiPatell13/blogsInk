"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save } from "lucide-react"
import { authService, type User } from "@/lib/auth"

interface EditProfileModalProps {
  user: User
  onUpdate: (updatedUser: User) => void
}

export function EditProfileModal({ user, onUpdate }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || "")
  const [avatar, setAvatar] = useState(user.avatar || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)

    // In a real app, this would make an API call
    // For now, we'll simulate updating the user
    const updatedUser: User = {
      ...user,
      name: name.trim(),
      bio: bio.trim(),
      avatar: avatar.trim() || user.avatar,
    }

    // Update the mock user data (in a real app, this would be an API call)
    const users = authService.getAllUsers()
    const userIndex = users.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
    }

    // Update localStorage auth token
    const currentAuth = authService.getCurrentUser()
    if (currentAuth) {
      const newAuthToken = {
        ...currentAuth,
        user: updatedUser,
      }
      localStorage.setItem("authToken", JSON.stringify(newAuthToken))
    }

    onUpdate(updatedUser)
    setIsLoading(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar || user.avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback className="text-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
