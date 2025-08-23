"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Plus } from "lucide-react"

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (tags: string[]) => void
  isLoading?: boolean
}

export function PublishModal({ isOpen, onClose, onPublish, isLoading }: PublishModalProps) {
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [error, setError] = useState("")

  const addTag = () => {
    const trimmedTag = currentTag.trim().toLowerCase()
    if (!trimmedTag) return

    if (tags.includes(trimmedTag)) {
      setError("Tag already added")
      return
    }

    if (tags.length >= 7) {
      setError("Maximum 7 tags allowed")
      return
    }

    setTags([...tags, trimmedTag])
    setCurrentTag("")
    setError("")
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
    setError("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handlePublish = () => {
    if (tags.length < 3) {
      setError("Please add at least 3 tags")
      return
    }
    onPublish(tags)
  }

  const suggestedTags = [
    "technology",
    "programming",
    "javascript",
    "react",
    "nextjs",
    "web development",
    "tutorial",
    "tips",
    "career",
    "productivity",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add tags to your story</DialogTitle>
          <DialogDescription>
            Tags help readers discover your story. Add 3-7 tags that describe your content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-input">Add tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tag-input"
                placeholder="Enter a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!currentTag.trim() || tags.length >= 7}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Your tags ({tags.length}/7)</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Tags */}
          <div className="space-y-2">
            <Label>Suggested tags</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter((tag) => !tags.includes(tag))
                .slice(0, 6)
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-300"
                    onClick={() => {
                      if (tags.length < 7) {
                        setTags([...tags, tag])
                        setError("")
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</div>}

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500">
              {tags.length < 3 ? `Add ${3 - tags.length} more tags` : "Ready to publish!"}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={tags.length < 3 || isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isLoading ? "Publishing..." : "Publish Now"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
