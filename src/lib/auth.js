const KEY = "rentbasket_auth";

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const setAuth = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const clearAuth = () => localStorage.removeItem(KEY);

export const isAuthenticated = () => Boolean(getAuth()?.token ?? getAuth()?.phone);
