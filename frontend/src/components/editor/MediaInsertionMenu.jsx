import React, { useState } from 'react'
import { Image, Link, Video, FileText, X } from 'lucide-react'

const MediaInsertionMenu = ({ isOpen, onClose, onInsert }) => {
  const [mediaType, setMediaType] = useState('image')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaAlt, setMediaAlt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!mediaUrl.trim()) return

    const mediaData = {
      type: mediaType,
      url: mediaUrl.trim(),
      alt: mediaAlt.trim() || mediaUrl.trim()
    }

    onInsert(mediaData)
    onClose()
    setMediaUrl('')
    setMediaAlt('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Insert Media
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'image', icon: Image, label: 'Image' },
                { value: 'video', icon: Video, label: 'Video' },
                { value: 'link', icon: Link, label: 'Link' }
              ].map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setMediaType(type.value)}
                    className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                      mediaType === type.value
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* URL Input */}
          <div>
            <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 mb-2">
              {mediaType === 'image' ? 'Image URL' : mediaType === 'video' ? 'Video URL' : 'Link URL'}
            </label>
            <input
              type="url"
              id="mediaUrl"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder={`Enter ${mediaType} URL...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          {/* Alt Text for Images */}
          {mediaType === 'image' && (
            <div>
              <label htmlFor="mediaAlt" className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text (Description)
              </label>
              <input
                type="text"
                id="mediaAlt"
                value={mediaAlt}
                onChange={(e) => setMediaAlt(e.target.value)}
                placeholder="Describe the image for accessibility..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Preview */}
          {mediaUrl && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              {mediaType === 'image' && (
                <img
                  src={mediaUrl}
                  alt={mediaAlt || 'Preview'}
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              {mediaType === 'video' && (
                <video
                  src={mediaUrl}
                  className="w-full h-32 object-cover rounded border"
                  controls
                />
              )}
              {mediaType === 'link' && (
                <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                  <Link className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-yellow-600 truncate">{mediaUrl}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Insert {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MediaInsertionMenu
