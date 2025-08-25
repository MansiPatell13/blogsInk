import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth.jsx'
import { useTheme } from '../utils/ThemeContext'
import { Save, Eye, Send, Image, Link, Video, FileText, X } from 'lucide-react'
import RichTextEditor from '../components/editor/RichTextEditor'
import api from '../utils/api'

const WritePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [autoSaveInterval, setAutoSaveInterval] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Set up auto-save every 30 seconds
    const interval = setInterval(() => {
      if (hasUnsavedChanges && (title || content)) {
        autoSave()
      }
    }, 30000)

    setAutoSaveInterval(interval)

    // Warn user before leaving with unsaved changes
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [user, navigate, hasUnsavedChanges, title, content])

  const handleContentChange = (newContent) => {
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    setHasUnsavedChanges(true)
  }

  const handleExcerptChange = (e) => {
    setExcerpt(e.target.value)
    setHasUnsavedChanges(true)
  }

  const autoSave = async () => {
    if (!title || !content) return

    try {
      await api.post('/blogs/draft', {
        title,
        content,
        excerpt,
        status: 'draft'
      })
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }

  const saveDraft = async () => {
    if (!title || !content) {
      alert('Please add a title and content before saving')
      return
    }

    setIsSaving(true)
    try {
      const response = await api.post('/blogs/draft', {
        title,
        content,
        excerpt,
        status: 'draft'
      })
      setHasUnsavedChanges(false)
      alert('Draft saved successfully!')
      console.log('Draft saved:', response.data)
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async (publishData) => {
    if (!title || !content) {
      alert('Please add a title and content before publishing')
      return
    }

    setIsSaving(true)
    try {
      const response = await api.post('/blogs/draft', {
        title,
        content,
        excerpt,
        category: publishData.category || 'Technology',
        tags: publishData.tags || [],
        status: 'published'
      })
      
      setHasUnsavedChanges(false)
      alert('Blog published successfully!')
      console.log('Blog published:', response.data)
      
      // Redirect to the published blog
      if (response.data.blog && response.data.blog._id) {
        navigate(`/blog/${response.data.blog._id}`)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Error publishing blog:', error)
      alert('Failed to publish blog. Please try again.')
    } finally {
      setIsSaving(false)
      setIsPublishModalOpen(false)
    }
  }

  const handlePreview = () => {
    // Save current content to localStorage for preview
    localStorage.setItem('blogPreview', JSON.stringify({
      title,
      content,
      excerpt,
      author: user
    }))
    
    // Open preview in new tab
    window.open('/preview', '_blank')
  }

  if (!user) {
    return null
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Write New Post</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={saveDraft}
                disabled={isSaving || (!title && !content)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                onClick={handlePreview}
                disabled={!title || !content}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => setIsPublishModalOpen(true)}
                disabled={!title || !content}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>

          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-yellow-600">
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
              <span>You have unsaved changes</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            {/* Title Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Write your title here..."
                value={title}
                onChange={handleTitleChange}
                className={`w-full text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} border-none outline-none bg-transparent ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
                maxLength={100}
              />
              <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {title.length}/100 characters
              </div>
            </div>

            {/* Excerpt Input */}
            <div className="mb-6">
              <textarea
                placeholder="Write a brief excerpt for your post..."
                value={excerpt}
                onChange={handleExcerptChange}
                className={`w-full p-3 border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-700'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none`}
                rows={3}
                maxLength={200}
              />
              <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {excerpt.length}/200 characters
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
              <RichTextEditor
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing your story..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Writing Tips */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Writing Tips</h3>
                <div className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Start with a compelling hook to grab readers' attention</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use clear, concise language and short paragraphs</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Include relevant images and media to enhance your content</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>End with a strong conclusion that leaves readers thinking</span>
                  </div>
                </div>
              </div>

              {/* Word Count */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Words</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Characters</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {content.replace(/<[^>]*>/g, '').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reading Time</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {Math.ceil(content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0).length / 200)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Quick Actions</h3>
                <div className="space-y-3">
                  <button className={`w-full flex items-center space-x-3 p-3 text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                    <Image className="w-5 h-5 text-yellow-600" />
                    <span>Add Image</span>
                  </button>
                  <button className={`w-full flex items-center space-x-3 p-3 text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}>
                    <Link className="w-5 h-5 text-green-600" />
                    <span>Insert Link</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-purple-600" />
                    <span>Embed Video</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <span>Import Document</span>
                  </button>
                </div>
              </div>

              {/* Auto-save Status */}
              <div className={`${isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} rounded-lg border p-6`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-yellow-200' : 'text-yellow-900'} mb-2`}>Auto-save</h3>
                <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Your work is automatically saved every 30 seconds. 
                  You can also manually save your draft at any time.
                </p>
                {hasUnsavedChanges && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                    <span>Changes pending...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Blog</h3>
            <p className="text-gray-600 mb-6">
              Are you ready to publish your blog? This will make it visible to all users.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePublish({})}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WritePage
