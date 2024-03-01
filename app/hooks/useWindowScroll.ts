import { useEffect, useState } from 'react';

export const useWindowScroll = (scrollY: number = 50) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const listenScrollEvent = () => {
    window.scrollY > scrollY ? setIsScrolled(true) : setIsScrolled(false);
  };
  useEffect(() => {
    window.scrollY > scrollY ? setIsScrolled(true) : setIsScrolled(false);
    window.addEventListener('scroll', listenScrollEvent);
    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
    };
  }, []);
  return isScrolled;
};
