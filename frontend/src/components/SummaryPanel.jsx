import React from 'react';

function StatusBadge({ status, loadProgress }) {
  if (status === 'ready')
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
        Ready
      </span>
    );
  if (status === 'loading')
    return (
      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary animate-pulse uppercase tracking-wider">
        {loadProgress > 0 ? `${loadProgress}%` : 'Loading…'}
      </span>
    );
  return (
    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-500 uppercase tracking-wider">
      Error
    </span>
  );
}

function LatencyChip({ value, label }) {
  if (value === null) return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</span>
      <span className="text-xs font-mono text-text-secondary/30">—</span>
    </div>
  );
  
  const color = value < 50 ? 'text-emerald-500' : value < 150 ? 'text-amber-500' : 'text-rose-500';
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={`w-1 h-1 rounded-full ${color.replace('text', 'bg')}`}></div>
        <span className={`text-xs font-mono font-bold ${color}`}>
          {value.toFixed(0)}ms
        </span>
      </div>
    </div>
  );
}

export default function SummaryPanel({
  modelStatus    = 'uninitialized',
  loadTime       = null,
  loadProgress   = 0,
  currentSummary = null,
  lastLatency    = null,
  avgLatency     = null,
  processing     = false,
  lastPhrase     = null,
  phraseCount    = 0,
  isSpeaking     = false,
  ttsSupported   = false,
}) {
  return (
    <div className="flex flex-col h-full gap-4 transition-colors duration-300">
      
      {/* Summary view */}
      <section className="flex-1 min-h-[200px] flex flex-col bg-card rounded-xl border border-text-secondary/10 shadow-sm overflow-hidden group">
        <div className="px-5 py-4 border-b border-text-secondary/5 bg-text-secondary/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Real-time Summary
            </h2>
          </div>
          {processing && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">AI Processing</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-6 relative">
          {currentSummary ? (
            <div className="animate-slide-up">
              <p className="text-sm text-text-primary/90 leading-relaxed font-semibold italic">
                "{currentSummary}"
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-text-secondary/10"></div>
                <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest italic">Insight</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-text-secondary max-w-[200px] leading-relaxed font-medium italic">
                Waiting for conversation...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats and status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
        
        {/* Fillers */}
        <section className="bg-card rounded-xl border border-text-secondary/10 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/60">
              Fillers
            </h3>
            {isSpeaking && (
              <div className="flex gap-0.5 items-end h-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-0.5 bg-emerald-500 rounded-full animate-wave" style={{ height: '100%', animationDelay: `${i * 0.15}s` }}></div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-black text-text-primary tracking-tight">{phraseCount}</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Triggers</p>
            </div>
            {lastPhrase && (
              <div className="text-right">
                <p className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest mb-1">Latest</p>
                <span className="px-2 py-1 rounded-lg bg-text-secondary/5 text-xs font-bold text-text-primary italic">
                  "{lastPhrase}"
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Engine status */}
        <section className="bg-card rounded-xl border border-text-secondary/10 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/60">
              AI Engine
            </h3>
            <StatusBadge status={modelStatus} loadProgress={loadProgress} />
          </div>
          
          <div className="space-y-2">
            <LatencyChip value={lastLatency} label="Last" />
            <LatencyChip value={avgLatency}  label="Avg" />
          </div>
        </section>

      </div>
    </div>
  );
}
