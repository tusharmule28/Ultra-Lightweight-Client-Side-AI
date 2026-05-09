import React, { useEffect, useRef } from 'react';

export default function TranscriptPanel({
  transcripts = [],
  interimText = '',
  isListening = false,
  isSupported = true,
  onClear,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, interimText]);

  const isEmpty = transcripts.length === 0 && !interimText;

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-text-secondary/10 shadow-sm overflow-hidden transition-colors duration-300">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-text-secondary/5 bg-text-secondary/[0.02] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Live Transcript
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {!isEmpty && (
            <button
              onClick={onClear}
              title="Clear"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-text-secondary hover:text-rose-500 hover:bg-rose-500/5 transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          )}

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-text-secondary/5">
            {isListening ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                </span>
                <span className="text-[10px] font-bold text-rose-500 tracking-wider">LIVE</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-text-secondary/30" />
                <span className="text-[10px] font-bold text-text-secondary/60 tracking-wider">OFF</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        
        {!isSupported && (
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
            <svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-sm font-bold text-amber-600 mb-1">Incompatible Browser</h3>
              <p className="text-xs text-amber-600/80 leading-relaxed font-medium">
                Speech API not supported. Use <strong>Chrome</strong> or <strong>Edge</strong>.
              </p>
            </div>
          </div>
        )}

        {isSupported && isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-slide-up">
            <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-xs text-text-secondary max-w-[200px] leading-relaxed italic">
              Start talking to see the transcript...
            </p>
          </div>
        )}

        <div className="space-y-6">
          {transcripts.map((entry) => (
            <div key={entry.id} className="animate-slide-up group">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">Y</span>
                <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">You</span>
                <span className="text-[10px] text-text-secondary/50 font-medium ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  {entry.time}
                </span>
              </div>
              <div className="pl-8">
                <p className="text-sm text-text-primary/90 leading-relaxed font-medium">{entry.text}</p>
              </div>
            </div>
          ))}

          {interimText && (
            <div className="animate-pulse-soft">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-text-secondary/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-pulse"></div>
                </div>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">...</span>
              </div>
              <div className="pl-8">
                <p className="text-sm text-text-secondary leading-relaxed italic font-medium">{interimText}</p>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Mic feedback */}
      {isListening && (
        <div className="h-1 bg-text-secondary/5 shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-around px-4">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-primary/40 rounded-full animate-wave"
                style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.05}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
