const COOKIE_NAME = 'accessToken';
const COOKIE_HOURS = 1;
const EXPIRES = true; // Set to false to use session cookies

export const setAccessCookie = (value: string): void => {
  if (EXPIRES) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + COOKIE_HOURS * 60 * 60 * 1000);
    const cookieValue = `${COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  } else {
    const cookieValue = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/`;
    document.cookie = cookieValue;
  }
};

export const getAccessCookie = (): string | null => {
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim());

    if (cookieName === COOKIE_NAME) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
};

export const deleteAccessCookie = (): void => {
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [cookieName] = cookie.split('=').map((c) => c.trim());

    if (cookieName === COOKIE_NAME) {
      const cookieToDelete = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = cookieToDelete;
      break;
    }
  }
};
