import React from 'react';

const ResponsiveImage = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  loading = 'lazy',
  aspectRatio = 'auto',
  objectFit = 'cover',
  rounded = 'md',
  fallback = '/images/placeholder.jpg'
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  // Handle image load error
  const handleError = () => {
    setError(true);
    setImgSrc(fallback);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    'auto': '',
    '1/1': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    '2/1': 'aspect-[2/1]'
  };

  // Object fit classes
  const objectFitClasses = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  };

  // Rounded classes
  const roundedClasses = {
    'none': '',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    'full': 'rounded-full'
  };

  return (
    <div 
      className={`
        relative overflow-hidden
        ${aspectRatioClasses[aspectRatio] || ''}
        ${roundedClasses[rounded] || 'rounded-md'}
        ${className}
      `}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
        className={`
          w-full h-full
          ${objectFitClasses[objectFit] || 'object-cover'}
          ${error ? 'opacity-60' : ''}
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
      />
    </div>
  );
};

export default ResponsiveImage;