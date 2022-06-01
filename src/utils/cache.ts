export const getCache = (key: string) => {
  const item = localStorage.getItem(key.toString());
  if (!item) return null;
  const data = JSON.parse(item);
  if (data !== null) {
    if (data.expiresAt !== null && data.expiresAt < new Date().getTime()) {
      localStorage.removeItem(key.toString());
    } else {
      return data.value;
    }
  }
  return null;
};

export const saveCache = (key: string, value: unknown, ttlMs = 0) => {
  localStorage.removeItem(key.toString());
  const data = { expiresAt: new Date().getTime() + ttlMs / 1, value: value };
  localStorage.setItem(key.toString(), JSON.stringify(data));
};
