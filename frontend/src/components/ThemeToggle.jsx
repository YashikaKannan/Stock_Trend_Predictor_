import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-pressed={theme === 'dark'}
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm md:text-base"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{ background: 'var(--panel-bg)', color: 'var(--text-color)', border: '1px solid rgba(148,163,184,0.06)' }}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
