import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import apiWithFallback from '../../utils/apiWithFallback'

const DummyDataBanner = () => {
  if (!apiWithFallback.isUsingDummyData()) {
    return null
  }

  const handleRetryBackend = () => {
    apiWithFallback.resetToBackend()
    window.location.reload()
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Backend unavailable, showing sample data
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              All interactions are simulated and won't be saved
            </p>
          </div>
        </div>
        <button
          onClick={handleRetryBackend}
          className="flex items-center px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry Backend
        </button>
      </div>
    </div>
  )
}

export default DummyDataBanner
