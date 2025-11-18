import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-based reveal animations using Intersection Observer
 * @param threshold - The percentage of the element that needs to be visible (0.0 to 1.0)
 * @returns Object with ref to attach to element and isVisible state
 */
export function useScrollReveal(threshold: number = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: disconnect after first reveal for performance
          // observer.disconnect();
        }
      },
      {
        threshold,
        // Add root margin for earlier triggering if needed
        rootMargin: '0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
}

