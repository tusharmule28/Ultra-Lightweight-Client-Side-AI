import React, { useState, useEffect, useRef } from 'react';

export default function MetricsBar({
  isListening  = false,
  wordCount    = 0,
  entryCount   = 0,
  modelStatus  = 'uninitialized',
  loadTime     = null,
  lastLatency  = null,
  avgLatency   = null,
  phraseCount  = 0,
}) {
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef(null);
  const startAt = useRef(null);

  useEffect(() => {
    if (isListening) {
      startAt.current = Date.now() - elapsed * 1000;
      timer.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startAt.current) / 1000));
      }, 1000);
    } else {
      clearInterval(timer.current);
      setElapsed(0);
    }
    return () => clearInterval(timer.current);
  }, [isListening]);

  const format = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const statusColor = {
    ready:         'bg-emerald-500',
    loading:       'bg-amber-500 animate-pulse',
    error:         'bg-rose-500',
    uninitialized: 'bg-text-secondary/30',
  }[modelStatus] || 'bg-text-secondary/30';

  return (
    <footer className="h-14 bg-card border-t border-text-secondary/10 flex items-center px-6 justify-between shrink-0 text-[10px] font-bold text-text-secondary uppercase tracking-widest transition-colors duration-300">
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${modelStatus === 'ready' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            <span>Status: {modelStatus === 'ready' ? 'OK' : '...'}</span>
          </div>
          <div className="h-3 w-px bg-text-secondary/10"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>OFFLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-text-secondary/5">
          <span className="text-text-secondary/40">TIME</span>
          <span className="font-mono text-text-primary text-xs tracking-normal">{format(elapsed)}</span>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary/40">Words</span>
            <span className="text-text-primary">{wordCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary/40">Fillers</span>
            <span className="text-text-primary">{phraseCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary/40 text-[9px]">BOOT</span>
            <span className="text-text-primary font-mono tracking-tight">{loadTime !== null ? `${loadTime.toFixed(0)}ms` : '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary/40 text-[9px]">INF</span>
            <span className={`font-mono tracking-tight ${lastLatency > 150 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {lastLatency !== null ? `${lastLatency.toFixed(0)}ms` : '—'}
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 ${
          modelStatus === 'ready' 
            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' 
            : 'bg-text-secondary/5 border-text-secondary/10 text-text-secondary'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></div>
          <span className="text-[9px]">MiniLM-L6-v2</span>
        </div>
      </div>
    </footer>
  );
}
