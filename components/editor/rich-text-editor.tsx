"use client"

import { useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Start writing...", label }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current && !quillRef.current) {
      // Dynamically import Quill to avoid SSR issues
      import("react-quill").then((ReactQuill) => {
        import("react-quill/dist/quill.snow.css")

        const Quill = ReactQuill.default

        // Custom toolbar configuration
        const toolbarOptions = [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ align: [] }],
          ["clean"],
        ]

        const QuillComponent = () => (
          <Quill
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            modules={{
              toolbar: toolbarOptions,
              clipboard: {
                matchVisual: false,
              },
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "link",
              "image",
              "align",
              "code-block",
            ]}
            style={{
              height: "400px",
              marginBottom: "50px",
            }}
          />
        )

        // Render the component
        if (editorRef.current) {
          const React = require("react")
          const ReactDOM = require("react-dom/client")
          const root = ReactDOM.createRoot(editorRef.current)
          root.render(React.createElement(QuillComponent))
          quillRef.current = root
        }
      })
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.unmount()
        quillRef.current = null
      }
    }
  }, [])

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && editorRef.current) {
      const quillInstance = editorRef.current.querySelector(".ql-editor")
      if (quillInstance && quillInstance.innerHTML !== value) {
        quillInstance.innerHTML = value
      }
    }
  }, [value])

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="border rounded-md">
        <div ref={editorRef} />
      </div>
      <p className="text-xs text-gray-500">
        Use the toolbar above to format your content with headings, bold text, lists, links, and more.
      </p>
    </div>
  )
}

// Fallback simple editor for when Quill fails to load
export function SimpleTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor="content">{label}</Label>}
      <textarea
        id="content"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={15}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
      />
      <p className="text-xs text-gray-500">
        You can use HTML tags for formatting: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;,
        etc.
      </p>
    </div>
  )
}
