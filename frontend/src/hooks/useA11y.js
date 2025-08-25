import { useEffect, useCallback } from 'react'

export const useKeyboardNavigation = ({
  onArrowDown,
  onArrowUp,
  onEnter,
  onEscape,
  onTab,
  onHome,
  onEnd
}) => {
  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        onArrowDown?.()
        break
      case 'ArrowUp':
        event.preventDefault()
        onArrowUp?.()
        break
      case 'Enter':
        event.preventDefault()
        onEnter?.()
        break
      case 'Escape':
        event.preventDefault()
        onEscape?.()
        break
      case 'Tab':
        onTab?.()
        break
      case 'Home':
        event.preventDefault()
        onHome?.()
        break
      case 'End':
        event.preventDefault()
        onEnd?.()
        break
      default:
        break
    }
  }, [onArrowDown, onArrowUp, onEnter, onEscape, onTab, onHome, onEnd])

  const registerContainer = useCallback((container) => {
    if (container) {
      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return { registerContainer }
}

/**
 * Custom hook for managing ARIA live regions
 * 
 * @param {string} message - Message to announce
 * @param {string} [politeness='polite'] - ARIA live politeness setting ('polite' or 'assertive')
 */
export const useAnnounce = (message, politeness = 'polite') => {
  useEffect(() => {
    if (!message) return;

    // Create or find the live region element
    let liveRegion = document.getElementById(`a11y-announce-${politeness}`);
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = `a11y-announce-${politeness}`;
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('role', 'status');
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.padding = '0';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      liveRegion.style.whiteSpace = 'nowrap';
      liveRegion.style.border = '0';
      document.body.appendChild(liveRegion);
    }

    // Set the message
    liveRegion.textContent = message;

    // Clean up function
    return () => {
      // Only remove if we created it in this hook instance
      // We don't want to remove it if other instances are using it
    };
  }, [message, politeness]);
};

/**
 * Custom hook for managing skip links for keyboard navigation
 */
export const useSkipLink = () => {
  useEffect(() => {
    // Create skip link if it doesn't exist
    let skipLink = document.getElementById('skip-to-content');
    
    if (!skipLink) {
      skipLink = document.createElement('a');
      skipLink.id = 'skip-to-content';
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.position = 'absolute';
      skipLink.style.top = '-40px';
      skipLink.style.left = '0';
      skipLink.style.padding = '8px';
      skipLink.style.zIndex = '100';
      skipLink.style.background = '#000';
      skipLink.style.color = '#fff';
      skipLink.style.transition = 'top 0.3s';
      
      // Show the skip link when it receives focus
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
      });
      
      // Hide the skip link when it loses focus
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Ensure the main content area has an id and is focusable
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
      if (!mainContent.hasAttribute('tabindex')) {
        mainContent.setAttribute('tabindex', '-1');
      }
    }
    
    // No cleanup needed as we want the skip link to persist
  }, []);
};