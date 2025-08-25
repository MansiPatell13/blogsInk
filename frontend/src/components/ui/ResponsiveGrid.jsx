import React from 'react';

const ResponsiveGrid = ({
  children,
  className = '',
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = { x: 4, y: 4 },
  as = 'div'
}) => {
  const Tag = as;
  
  // Convert column configuration to Tailwind classes
  const getColClasses = () => {
    const baseClass = `grid-cols-${cols.default || 1}`;
    const smClass = cols.sm ? `sm:grid-cols-${cols.sm}` : '';
    const mdClass = cols.md ? `md:grid-cols-${cols.md}` : '';
    const lgClass = cols.lg ? `lg:grid-cols-${cols.lg}` : '';
    const xlClass = cols.xl ? `xl:grid-cols-${cols.xl}` : '';
    const xxlClass = cols['2xl'] ? `2xl:grid-cols-${cols['2xl']}` : '';
    
    return `${baseClass} ${smClass} ${mdClass} ${lgClass} ${xlClass} ${xxlClass}`;
  };
  
  // Convert gap configuration to Tailwind classes
  const getGapClasses = () => {
    const xGap = gap.x ? `gap-x-${gap.x}` : '';
    const yGap = gap.y ? `gap-y-${gap.y}` : '';
    
    return `${xGap} ${yGap}`;
  };

  return (
    <Tag 
      className={`
        grid
        ${getColClasses()}
        ${getGapClasses()}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

export default ResponsiveGrid;