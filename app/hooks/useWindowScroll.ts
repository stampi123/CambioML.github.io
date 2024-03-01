import { useEffect, useState } from 'react';

export const useWindowScroll = (scrollY: number = 50) => {
  const [isScrolled, setIsScrolled] = useState(window.scrollY > scrollY);
  const listenScrollEvent = () => {
    window.scrollY > scrollY ? setIsScrolled(true) : setIsScrolled(false);
  };
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
    };
  }, []);
  return isScrolled;
};
