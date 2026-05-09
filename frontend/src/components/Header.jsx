import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ isListening = false, isSupported = true, error = null, onStart, onStop }) {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    if (isListening) onStop?.();
    else onStart?.();
  };

  return (
    <header className="h-16 bg-card border-b border-text-secondary/10 flex items-center justify-between px-6 shrink-0 z-10 transition-colors duration-300">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-text-primary">Interview Assistant</h1>
          <p className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">Edge-AI Hackathon</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-text-secondary">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSupported ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            <span>Speech API: {isSupported ? 'OK' : 'FAIL'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-primary animate-pulse' : 'bg-text-secondary/30'}`}></div>
            <span>{isListening ? 'Listening' : 'Idle'}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-text-secondary/10 mx-1"></div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-text-secondary/10 transition-colors text-text-secondary hover:text-text-primary"
          title="Toggle theme"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        <button
          id="interview-toggle-btn"
          onClick={handleToggle}
          disabled={!isSupported}
          className={`
            relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold
            transition-all duration-300 focus:outline-none 
            disabled:opacity-40 disabled:cursor-not-allowed
            ${isListening
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20'
              : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
            }
          `}
        >
          <div className={`w-2 h-2 rounded-full bg-white ${isListening ? 'animate-ping' : ''}`} />
          {isListening ? 'Stop' : 'Start Session'}
        </button>
      </div>
    </header>
  );
}
