const STORAGE_KEY = 'accessToken';

export const setAccessStorage = (
  value: string,
  expiresInHours: number = 1,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): void => {
  const expirationTime = new Date().getTime() + expiresInHours * 60 * 60 * 1000;
  const data = { value, expiresAt: expirationTime };
  const serializedData = JSON.stringify(data);

  if (storageType === 'localStorage') {
    localStorage.setItem(STORAGE_KEY, serializedData);
  } else {
    sessionStorage.setItem(STORAGE_KEY, serializedData);
  }
};

export const getAccessStorage = (): string | null => {
  const storedData = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);

  if (storedData) {
    const data = JSON.parse(storedData);
    const expirationTime = data.expiresAt;

    if (expirationTime && expirationTime > new Date().getTime()) {
      return data.value;
    }
  }

  return null;
};

export const deleteAccessStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
};
