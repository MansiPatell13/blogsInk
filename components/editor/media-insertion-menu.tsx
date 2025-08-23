"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ImageIcon, Video, Quote, Code, Plus } from "lucide-react"

interface MediaInsertionMenuProps {
  onInsert: (type: string, content?: string) => void
  className?: string
}

export function MediaInsertionMenu({ onInsert, className = "" }: MediaInsertionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleInsert = (type: string) => {
    let content = ""

    switch (type) {
      case "image":
        content = "![Image description](image-url)"
        break
      case "video":
        content = "[Video: Add your video URL here]"
        break
      case "quote":
        content = "> Add your quote here"
        break
      case "code":
        content = "```\n// Add your code here\n```"
        break
    }

    onInsert(type, content)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`w-8 h-8 rounded-full border border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 p-0 ${className}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => handleInsert("image")} className="flex items-center space-x-2">
          <ImageIcon className="h-4 w-4" />
          <span>Add Image</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleInsert("video")} className="flex items-center space-x-2">
          <Video className="h-4 w-4" />
          <span>Add Video</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleInsert("quote")} className="flex items-center space-x-2">
          <Quote className="h-4 w-4" />
          <span>Add Quote</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleInsert("code")} className="flex items-center space-x-2">
          <Code className="h-4 w-4" />
          <span>Add Code</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
