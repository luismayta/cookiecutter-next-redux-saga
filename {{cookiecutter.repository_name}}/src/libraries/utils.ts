import cookies from 'js-cookie';

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const getCookie = (key: string) => {
  return cookies.get(key);
};

export const setCookie = (
  key: string,
  value: any,
  options?: cookies.CookieAttributes,
) => {
  cookies.set(key, value, options);
};

export const removeCookie = (
  key: string,
  options?: cookies.CookieAttributes,
) => {
  cookies.remove(key, options);
};
