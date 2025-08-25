import React from 'react';

/**
 * SeoImage component for optimized images with proper attributes for SEO
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for the image (required for SEO)
 * @param {string} props.title - Image title attribute
 * @param {string} props.width - Image width
 * @param {string} props.height - Image height
 * @param {string} props.loading - Image loading attribute (lazy, eager, auto)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.imgProps - Additional image attributes
 */
const SeoImage = ({
  src,
  alt,
  title,
  width,
  height,
  loading = 'lazy',
  className = '',
  imgProps = {},
}) => {
  // Ensure alt text is provided for accessibility and SEO
  if (!alt) {
    console.warn('SeoImage: Alt text is required for accessibility and SEO');
  }

  return (
    <img
      src={src}
      alt={alt || ''} // Fallback to empty string if not provided
      title={title}
      width={width}
      height={height}
      loading={loading}
      className={className}
      {...imgProps}
    />
  );
};

/**
 * ResponsiveImage component for optimized responsive images with srcset
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Default image source URL
 * @param {string} props.alt - Alternative text for the image (required for SEO)
 * @param {string} props.title - Image title attribute
 * @param {Object} props.srcSet - Object mapping breakpoints to image URLs
 * @param {string} props.sizes - Sizes attribute for responsive images
 * @param {string} props.width - Image width
 * @param {string} props.height - Image height
 * @param {string} props.loading - Image loading attribute (lazy, eager, auto)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.imgProps - Additional image attributes
 */
export const ResponsiveImage = ({
  src,
  alt,
  title,
  srcSet = {},
  sizes,
  width,
  height,
  loading = 'lazy',
  className = '',
  imgProps = {},
}) => {
  // Ensure alt text is provided for accessibility and SEO
  if (!alt) {
    console.warn('ResponsiveImage: Alt text is required for accessibility and SEO');
  }

  // Format srcset attribute
  const srcSetString = Object.entries(srcSet)
    .map(([size, url]) => `${url} ${size}`)
    .join(', ');

  return (
    <img
      src={src}
      alt={alt || ''} // Fallback to empty string if not provided
      title={title}
      srcSet={srcSetString || undefined}
      sizes={sizes}
      width={width}
      height={height}
      loading={loading}
      className={className}
      {...imgProps}
    />
  );
};

/**
 * ImageWithFallback component that provides a fallback image if the main image fails to load
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.fallbackSrc - Fallback image source URL
 * @param {string} props.alt - Alternative text for the image (required for SEO)
 * @param {string} props.title - Image title attribute
 * @param {string} props.width - Image width
 * @param {string} props.height - Image height
 * @param {string} props.loading - Image loading attribute (lazy, eager, auto)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.imgProps - Additional image attributes
 */
export const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  title,
  width,
  height,
  loading = 'lazy',
  className = '',
  imgProps = {},
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);

  // Handle image load error
  const handleError = () => {
    if (imgSrc !== fallbackSrc && fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || ''} // Fallback to empty string if not provided
      title={title}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={handleError}
      {...imgProps}
    />
  );
};

export default SeoImage;