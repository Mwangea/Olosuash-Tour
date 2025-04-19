import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollPreserver = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const scrollPositions = React.useRef<Record<string, number>>({});

  useEffect(() => {
    // Save the current scroll position before leaving the page
    const saveScrollPosition = () => {
      scrollPositions.current[location.key] = window.scrollY;
    };

    // Restore the saved scroll position when returning to the page
    const restoreScrollPosition = () => {
      const savedPosition = scrollPositions.current[location.key];
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      } else {
        window.scrollTo(0, 0); // Default to top if no position saved
      }
    };

    // Add event listener for beforeunload to save position
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // Restore position when component mounts
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location.key]);

  return <>{children}</>;
};