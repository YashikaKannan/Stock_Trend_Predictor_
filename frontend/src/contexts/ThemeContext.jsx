import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme state synchronously from localStorage to avoid a flash of incorrect theme
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('stp_theme');
      return stored || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    // Apply theme class to document root
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light-mode', 'dark-mode');
      document.documentElement.classList.add(`${theme}-mode`);
    }
    try {
      localStorage.setItem('stp_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Sync theme across multiple tabs using storage event
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'stp_theme' && e.newValue) {
        setTheme(e.newValue);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;