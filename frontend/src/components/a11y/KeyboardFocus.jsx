import React, { useState, useEffect, useCallback } from 'react';

/**
 * KeyboardFocus component for managing focus styles only when using keyboard navigation
 * 
 * This component adds a class to the document body when keyboard navigation is detected
 * and removes it when mouse navigation is detected. This allows for styling focus
 * states only when they are relevant to keyboard users.
 */
const KeyboardFocus = () => {
  const [usingKeyboard, setUsingKeyboard] = useState(false);

  // Handle keyboard navigation detection
  const handleKeyDown = useCallback((event) => {
    // Tab key indicates keyboard navigation
    if (event.key === 'Tab') {
      setUsingKeyboard(true);
      document.body.classList.add('keyboard-focus');
    }
  }, []);

  // Handle mouse navigation detection
  const handleMouseDown = useCallback(() => {
    setUsingKeyboard(false);
    document.body.classList.remove('keyboard-focus');
  }, []);

  useEffect(() => {
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Clean up event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.body.classList.remove('keyboard-focus');
    };
  }, [handleKeyDown, handleMouseDown]);

  // This component doesn't render anything visible
  return null;
};

/**
 * FocusRing component for adding custom focus styles to elements
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.keyboardOnly - Whether to show focus ring only for keyboard navigation
 * @param {Object} props.style - Additional inline styles
 */
export const FocusRing = ({
  children,
  className = '',
  keyboardOnly = true,
  style = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);

  // Track keyboard navigation state from body class
  useEffect(() => {
    const checkKeyboardMode = () => {
      const isKeyboardMode = document.body.classList.contains('keyboard-focus');
      if (isFocused && isKeyboardMode) {
        setIsKeyboardFocused(true);
      } else {
        setIsKeyboardFocused(false);
      }
    };

    // Set up a mutation observer to watch for class changes on body
    const observer = new MutationObserver(checkKeyboardMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Initial check
    checkKeyboardMode();

    return () => observer.disconnect();
  }, [isFocused]);

  // Determine if focus ring should be visible
  const showFocusRing = keyboardOnly ? isKeyboardFocused : isFocused;

  return (
    <div
      className={`focus-ring-container ${className} ${showFocusRing ? 'focus-ring-active' : ''}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
      {showFocusRing && (
        <div
          className="focus-ring"
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '4px',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default KeyboardFocus;