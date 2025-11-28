import { useState, useRef, useCallback } from 'react';

/**
 * Hook to detect scroll direction and hide/show navigation bars
 * @param {number} threshold - Minimum scroll distance to trigger hide/show (default: 10)
 * @returns {Object} { isVisible, scrollHandler }
 */
export function useScrollHide(threshold = 10) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  const handleScroll = useCallback((event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDifference = currentScrollY - lastScrollY.current;

    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Only trigger if scroll difference is significant
    if (Math.abs(scrollDifference) > threshold) {
      if (scrollDifference > 0 && currentScrollY > 50) {
        // Scrolling down - hide bars
        setIsVisible(false);
      } else if (scrollDifference < 0) {
        // Scrolling up - show bars
        setIsVisible(true);
      }
    }

    // Show bars when at the top
    if (currentScrollY <= 0) {
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;

    // Auto-show bars after scrolling stops (optional)
    scrollTimeout.current = setTimeout(() => {
      // Keep bars visible when at top, otherwise show them
      if (currentScrollY > 100) {
        setIsVisible(true);
      }
    }, 1500);
  }, [threshold]);

  return { isVisible, handleScroll };
}

