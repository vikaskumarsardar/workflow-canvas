'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';

export const THEME_MODE = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export type Theme = (typeof THEME_MODE)[keyof typeof THEME_MODE];

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getSnapshot = (): Theme => {
  if (typeof window === 'undefined') return THEME_MODE.DARK;
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) return stored;
  return document.documentElement.classList.contains(THEME_MODE.LIGHT) ? THEME_MODE.LIGHT : THEME_MODE.DARK;
};

const getServerSnapshot = (): Theme => THEME_MODE.DARK;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === THEME_MODE.DARK;

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    if (newTheme === THEME_MODE.DARK) {
      document.documentElement.classList.add(THEME_MODE.DARK);
      document.documentElement.classList.remove(THEME_MODE.LIGHT);
    } else {
      document.documentElement.classList.add(THEME_MODE.LIGHT);
      document.documentElement.classList.remove(THEME_MODE.DARK);
    }
    // Dispatch storage event so useSyncExternalStore updates across listeners
    window.dispatchEvent(new Event('storage'));
  };

  const toggleTheme = () => {
    setTheme(isDark ? THEME_MODE.LIGHT : THEME_MODE.DARK);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

