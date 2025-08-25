import React, { useEffect, useState } from 'react';

/**
 * AriaLive component for creating accessible live regions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be announced
 * @param {string} props.politeness - ARIA live politeness setting ('polite' or 'assertive')
 * @param {boolean} props.atomic - Whether the entire live region should be announced at once
 * @param {boolean} props.relevant - What changes are relevant ('additions', 'removals', 'text', 'all')
 * @param {string} props.className - Additional CSS classes
 */
const AriaLive = ({
  children,
  politeness = 'polite',
  atomic = true,
  relevant = 'additions text',
  className = '',
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic.toString()}
      aria-relevant={relevant}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Announcer component for dynamically announcing messages to screen readers
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to announce
 * @param {string} props.politeness - ARIA live politeness setting ('polite' or 'assertive')
 * @param {number} props.clearDelay - Delay in ms before clearing the message (0 = never clear)
 */
export const Announcer = ({
  message,
  politeness = 'polite',
  clearDelay = 5000,
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!message) return;

    // Set the message
    setAnnouncement(message);

    // Clear the message after delay if specified
    if (clearDelay > 0) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, clearDelay);

      return () => clearTimeout(timer);
    }
  }, [message, clearDelay]);

  if (!announcement) return null;

  return (
    <AriaLive politeness={politeness}>
      {announcement}
    </AriaLive>
  );
};

/**
 * ProgressAnnouncer component for announcing progress updates
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Current progress value
 * @param {number} props.max - Maximum progress value
 * @param {string} props.label - Label for the progress
 * @param {boolean} props.showPercentage - Whether to announce percentage
 * @param {string} props.politeness - ARIA live politeness setting ('polite' or 'assertive')
 */
export const ProgressAnnouncer = ({
  value,
  max = 100,
  label = 'Progress',
  showPercentage = true,
  politeness = 'polite',
}) => {
  const percentage = Math.round((value / max) * 100);
  const announcement = showPercentage
    ? `${label}: ${percentage}%`
    : `${label}: ${value} of ${max}`;

  return (
    <AriaLive politeness={politeness}>
      {announcement}
    </AriaLive>
  );
};

export default AriaLive;