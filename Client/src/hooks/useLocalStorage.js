import { useState, useEffect } from 'react';

const getStorageValue = (key, defaultValue) => {
  // getting stored value
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(key);
    const initial = saved !== null ? saved : defaultValue;
    return initial;
  }
};

export const useLocalStorage = (key, initialState) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, initialState);
  });

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [value]);

  const clearState = () => window.localStorage.removeItem(key);

  return [value, setValue, clearState];
};

const getStorage = (key, defaultValue) => {
  // getting stored value
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
};

export const useStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorage(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const clearState = () => localStorage.removeItem(key);

  return [value, setValue, clearState];
};
