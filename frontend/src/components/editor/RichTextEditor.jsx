import React, { useState, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './quill-dark-mode.css'
import { Image, Link, Bold, Italic, List, ListOrdered, Quote, Code, Heading1, Heading2, Undo, Redo, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import useMediaQuery from '../../utils/useMediaQuery'
import { useTheme } from '../../utils/ThemeContext'

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Start writing your story...",
  readOnly = false,
  minHeight = "400px",
  maxHeight = "800px",
  className = "",
  onImageUpload,
  theme = "snow",
  showCharCount = true,
  maxCharCount,
  toolbarId
}) => {
  // Get current theme from context
  const { theme: currentTheme } = useTheme()
  const quillRef = useRef(null)
  const [quill, setQuill] = useState(null)
  const [showToolbar, setShowToolbar] = useState(true)
  const [charCount, setCharCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const isMobile = useMediaQuery('(max-width: 640px)')

  // Configure Quill modules based on props and device
  const modules = {
    toolbar: toolbarId || {
      container: [
        [{ 'header': isMobile ? [1, 2, false] : [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ...(isMobile ? [] : [[{ 'script': 'sub'}, { 'script': 'super' }]]),
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ...(isMobile ? [] : [[{ 'direction': 'rtl' }]]),
        ...(isMobile ? [] : [[{ 'size': ['small', false, 'large', 'huge'] }]]),
        ...(isMobile ? [[{ 'color': [] }]] : [[{ 'color': [] }, { 'background': [] }]]),
        ...(isMobile ? [] : [[{ 'font': [] }]]),
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', ...(isMobile ? [] : ['video'])],
        ['clean']
      ],
      handlers: {
        image: onImageUpload || handleImageUpload
      }
    },
    clipboard: {
      matchVisual: false,
    },
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function() {
            return true; // Let default tab behavior happen
          }
        }
      }
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'code-block', 'script'
  ]

  // Update character count when content changes
  useEffect(() => {
    if (showCharCount && value) {
      const textOnly = value.replace(/<[^>]*>/g, '')
      setCharCount(textOnly.length)
    }
  }, [value, showCharCount])

  // Default image upload handler
  function handleImageUpload() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      if (file) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB')
          return
        }
        
        try {
          // Create a FormData object to send the file
          const formData = new FormData()
          formData.append('image', file)
          
          // Show loading indicator in editor
          const range = quill?.getSelection() || { index: 0 }
          const loadingPlaceholder = 'Uploading image...'
          quill?.insertText(range.index, loadingPlaceholder)
          
          // Send the image to the server
          const response = await fetch('/api/uploads/content-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          })
          
          // Remove loading placeholder
          quill?.deleteText(range.index, loadingPlaceholder.length)
          
          if (!response.ok) {
            throw new Error('Failed to upload image')
          }
          
          const data = await response.json()
          
          // Insert the image URL from the server response
          quill?.insertEmbed(range.index, 'image', data.imageUrl)
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Failed to upload image. Please try again.')
        }
      }
    }
  }

  const handleLinkInsert = () => {
    const url = prompt('Enter URL:')
    if (url) {
      const range = quill?.getSelection()
      if (range) {
        quill?.insertText(range.index, url, 'link', url)
      }
    }
  }

  // Custom toolbar component
  const CustomToolbar = () => (
    <div className={`p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 ${isMobile ? 'overflow-x-auto' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Headings */}
        <div className="relative group">
          <button
            type="button"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Headings"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 mt-1 border dark:border-gray-700">
            <button 
              type="button" 
              onClick={() => quill?.format('header', 1)} 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Heading1 className="h-4 w-4 inline mr-2" /> Heading 1
            </button>
            <button 
              type="button" 
              onClick={() => quill?.format('header', 2)} 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Heading2 className="h-4 w-4 inline mr-2" /> Heading 2
            </button>
            <button 
              type="button" 
              onClick={() => quill?.format('header', false)} 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Normal Text
            </button>
          </div>
        </div>

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => quill?.format('bold', true)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Bold"
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => quill?.format('italic', true)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Italic"
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => quill?.format('list', 'bullet')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Bullet List"
          aria-label="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => quill?.format('list', 'ordered')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Numbered List"
          aria-label="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Alignment */}
        {!isMobile && (
          <div className="relative group">
            <button
              type="button"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Text Alignment"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 mt-1 border dark:border-gray-700">
              <button 
                type="button" 
                onClick={() => quill?.format('align', false)} 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <AlignLeft className="h-4 w-4 inline mr-2" /> Left
              </button>
              <button 
                type="button" 
                onClick={() => quill?.format('align', 'center')} 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <AlignCenter className="h-4 w-4 inline mr-2" /> Center
              </button>
              <button 
                type="button" 
                onClick={() => quill?.format('align', 'right')} 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <AlignRight className="h-4 w-4 inline mr-2" /> Right
              </button>
            </div>
          </div>
        )}

        {/* Block formatting */}
        <button
          type="button"
          onClick={() => quill?.format('blockquote', true)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Quote"
          aria-label="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => quill?.format('code-block', true)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Code Block"
          aria-label="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        {/* Media */}
        <button
          type="button"
          onClick={handleLinkInsert}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Insert Link"
          aria-label="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onImageUpload || handleImageUpload}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Insert Image"
          aria-label="Insert Image"
        >
          <Image className="w-4 h-4" />
        </button>

        {/* History */}
        {!isMobile && (
          <>
            <button
              type="button"
              onClick={() => quill?.history.undo()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Undo"
              aria-label="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quill?.history.redo()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Redo"
              aria-label="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Custom Toolbar */}
      {showToolbar && !readOnly && (
        <div className="mb-4">
          <CustomToolbar />
        </div>
      )}

      {/* Quill Editor */}
      <div 
        className={`border border-gray-300 dark:border-gray-700 rounded-lg ${isFocused ? 'ring-2 ring-primary-500' : ''}`}
        style={{ minHeight }}
      >
        <ReactQuill
          ref={quillRef}
          theme={theme}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${readOnly ? 'ql-disabled' : ''}`}
          style={{ 
            height: 'auto',
            maxHeight: maxHeight
          }}
          onInit={(editor) => setQuill(editor)}
        />
      </div>

      {/* Character Count */}
      {showCharCount && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
          {charCount} characters
          {maxCharCount && (
            <span> / {maxCharCount} {charCount > maxCharCount && (
              <span className="text-red-500">({charCount - maxCharCount} over limit)</span>
            )}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
