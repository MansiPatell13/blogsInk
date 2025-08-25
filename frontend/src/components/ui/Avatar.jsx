import React from 'react'
import { User } from 'lucide-react'

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback = null,
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none'
    e.target.nextSibling.style.display = 'flex'
  }

  const handleFallbackClick = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <div 
      className={`relative inline-block ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full rounded-full object-cover ${onClick ? 'cursor-pointer' : ''}`}
            onError={handleImageError}
          />
          {/* Fallback that shows on image error */}
          <div 
            className={`hidden w-full h-full rounded-full bg-gray-200 flex items-center justify-center ${onClick ? 'cursor-pointer' : ''}`}
            onClick={handleFallbackClick}
          >
            {fallback || <User className={`${textSizes[size]} text-gray-500`} />}
          </div>
        </>
      ) : (
        <div 
          className={`w-full h-full rounded-full bg-gray-200 flex items-center justify-center ${onClick ? 'cursor-pointer' : ''}`}
          onClick={handleFallbackClick}
        >
          {fallback || <User className={`${textSizes[size]} text-gray-500`} />}
        </div>
      )}
    </div>
  )
}

export default Avatar
