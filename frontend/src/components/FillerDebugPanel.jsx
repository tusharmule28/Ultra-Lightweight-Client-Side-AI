import React, { useState } from 'react';

const FillerDebugPanel = ({ debugInfo, lastPhrase, isListening }) => {
  const [show, setShow] = useState(false);

  if (!isListening && !show) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={() => setShow(!show)}
        className="mb-2 px-3 py-1 text-xs font-medium bg-secondary/80 text-text-primary rounded-full backdrop-blur-md border border-white/10 hover:bg-secondary transition-all"
      >
        {show ? 'Hide Debug' : 'Show Debug'}
      </button>

      {show && (
        <div className="w-64 p-4 rounded-2xl bg-surface/90 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Context Debug
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-text-secondary uppercase mb-1">Category</label>
              <div className="px-2 py-1 rounded bg-black/20 text-xs font-mono text-primary border border-primary/20 capitalize">
                {debugInfo.cat || 'none'}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-text-secondary uppercase mb-1">Pause Type</label>
              <div className="px-2 py-1 rounded bg-black/20 text-xs font-mono text-secondary border border-secondary/20 capitalize">
                {debugInfo.type || 'none'}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-text-secondary uppercase mb-1">Latest Filler</label>
              <div className="px-2 py-2 rounded bg-black/20 text-[11px] leading-relaxed italic text-text-primary border border-white/5">
                {lastPhrase ? `"${lastPhrase}"` : 'listening...'}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-text-secondary">
              <span>Status: {isListening ? 'Active' : 'Idle'}</span>
              <span>{debugInfo.at ? new Date(debugInfo.at).toLocaleTimeString() : '--:--:--'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FillerDebugPanel;
