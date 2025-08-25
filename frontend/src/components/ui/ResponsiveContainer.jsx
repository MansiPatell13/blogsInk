import React from 'react';

const ResponsiveContainer = ({ 
  children, 
  className = '',
  as = 'div',
  maxWidth = '6xl', // xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, full
  padding = true,
  centered = true
}) => {
  const Tag = as;
  
  // Max width classes
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
    'none': ''
  };

  return (
    <Tag 
      className={`
        ${maxWidthClasses[maxWidth] || maxWidthClasses['6xl']}
        ${padding ? 'px-4 sm:px-6 md:px-8' : ''}
        ${centered ? 'mx-auto' : ''}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

export default ResponsiveContainer;