import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'playgroundUserId';
const COOKIE_HOURS = 24;
const EXPIRES = true; // Set to false to use session cookies

const useUserId = (): string => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = getCookie(COOKIE_NAME);

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = uuidv4();
      setCookie(COOKIE_NAME, newUserId);
      setUserId(newUserId);
    }
  }, []);

  return userId as string;
};

const setCookie = (name: string, value: string): void => {
  if (EXPIRES) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + COOKIE_HOURS * 60 * 60 * 1000);
    const cookieValue = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  } else {
    const cookieValue = `${name}=${encodeURIComponent(value)}; path=/`;
    document.cookie = cookieValue;
  }
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim());

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
};

export default useUserId;
