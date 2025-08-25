import React from 'react';
import ScreenReaderOnly from './ScreenReaderOnly';

/**
 * AccessibleIcon component for making icons accessible to screen readers
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - The icon component to render
 * @param {string} props.label - Accessible label for screen readers
 * @param {string} props.className - Additional CSS classes for the icon wrapper
 * @param {Object} props.iconProps - Additional props to pass to the icon component
 */
const AccessibleIcon = ({
  icon: Icon,
  label,
  className = '',
  iconProps = {},
  ...props
}) => {
  if (!label) {
    console.warn('AccessibleIcon: Accessible label is required for screen readers');
  }

  return (
    <span
      className={`inline-flex ${className}`}
      role="img"
      aria-hidden="true"
      {...props}
    >
      {Icon && <Icon {...iconProps} />}
      {label && <ScreenReaderOnly>{label}</ScreenReaderOnly>}
    </span>
  );
};

export default AccessibleIcon;