import React from 'react';

const SummaryDebugPanel = ({ 
  processing, 
  lastLatency, 
  avgLatency, 
  transcriptCount, 
  modelStatus,
  currentSummary
}) => {
  if (modelStatus === 'uninitialized') return null;

  return (
    <div className="mt-4 p-3 bg-surface-dark/50 rounded-xl border border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Summary Debug
        </h3>
        <div className="flex items-center gap-2">
          {processing && (
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
            modelStatus === 'ready' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}>
            {modelStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="space-y-1">
          <p className="text-text-muted">Last: 
            <span className="text-text-primary ml-1 font-mono">
              {lastLatency ? `${lastLatency.toFixed(0)}ms` : '---'}
            </span>
          </p>
          <p className="text-text-muted">Avg: 
            <span className="text-text-primary ml-1 font-mono">
              {avgLatency ? `${avgLatency.toFixed(0)}ms` : '---'}
            </span>
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-text-muted">Count: 
            <span className="text-text-primary ml-1 font-mono">{transcriptCount}</span>
          </p>
          <p className="text-text-muted">TS: 
            <span className="text-text-primary ml-1 font-mono">
              {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </p>
        </div>
      </div>

      {currentSummary && (
        <div className="mt-3 pt-2 border-t border-white/5">
          <p className="text-[10px] text-text-muted uppercase mb-1">Active Summary</p>
          <p className="text-[11px] text-text-primary italic line-clamp-1 opacity-70">
            "{currentSummary}"
          </p>
        </div>
      )}
      
      {processing && (
        <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-shimmer w-1/3" />
        </div>
      )}
    </div>
  );
};

export default SummaryDebugPanel;
