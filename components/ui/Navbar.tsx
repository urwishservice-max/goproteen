'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  isNarrating: boolean;
  onToggleNarration: () => void;
  hasSpeechSupport: boolean;
}

export default function Navbar({
  isNarrating,
  onToggleNarration,
  hasSpeechSupport,
}: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = isDark ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-[6vw] py-6 z-40 pointer-events-auto">
      <a href="#" className="text-xl font-medium tracking-tight text-fg transition-opacity hover:opacity-80">
        GoProteen
      </a>

      <div className="flex items-center gap-3">
        {hasSpeechSupport && (
          <button
            onClick={onToggleNarration}
            className={`pill mono flex items-center gap-2 text-[11px] uppercase tracking-widest cursor-pointer transition-all ${
              isNarrating ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'hover:border-fg/40'
            }`}
            title="Read story audio narration"
          >
            {isNarrating ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
            <span>{isNarrating ? 'Listening' : 'Listen'}</span>
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="pill p-2 text-fg/80 hover:text-fg transition-all"
          aria-label="Toggle light/dark theme"
          title="Toggle color scheme"
        >
          {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>
      </div>
    </nav>
  );
}
