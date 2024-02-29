import { useEffect, useState } from 'react';

export const useWindowScroll = (scrollY: number = 50) => {
  const [isScrolled, setIsScrolled] = useState(() => {
    // Check if there's a stored scroll position in localStorage
    const storedScrollPosition = localStorage.getItem('scrollPosition');
    return storedScrollPosition ? parseInt(storedScrollPosition, 10) > scrollY : false;
  });

  const listenScrollEvent = () => {
    window.scrollY > scrollY ? setIsScrolled(true) : setIsScrolled(false);
  };

  useEffect(() => {
    // Listen to scroll event
    window.addEventListener('scroll', listenScrollEvent);

    return () => {
      // Remove event listener
      window.removeEventListener('scroll', listenScrollEvent);
    };
  }, []);

  // Save scroll position to localStorage when component unmounts
  useEffect(() => {
    const saveScrollPosition = () => {
      localStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  return isScrolled;
};
