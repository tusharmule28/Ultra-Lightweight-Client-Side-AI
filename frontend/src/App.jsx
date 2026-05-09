import React, { useMemo } from 'react';
import Header         from './components/Header';
import TranscriptPanel from './components/TranscriptPanel';
import SummaryPanel   from './components/SummaryPanel';
import MetricsBar     from './components/MetricsBar';
import { useInterview }  from './hooks/useInterview';
import { useSummarizer } from './hooks/useSummarizer';
import { useFillers }    from './hooks/useFillers';
import FillerDebugPanel  from './components/FillerDebugPanel';
import SummaryDebugPanel from './components/SummaryDebugPanel';

function App() {
  const {
    isListening,
    isSupported,
    error,
    transcripts,
    interimText,
    startInterview,
    stopInterview,
    clearTranscripts,
  } = useInterview();

  const {
    status: modelStatus,
    tLoad,
    progress: loadProgress,
    summary,
    latency,
    avgLat,
    busy: processing,
  } = useSummarizer({ transcripts });

  const {
    phrase: lastPhrase,
    count: phraseCount,
    speaking: isSpeaking,
    ttsOk,
    debug: debugInfo,
  } = useFillers({ transcripts, isListening });

  const wordCount = useMemo(
    () => transcripts.reduce((acc, t) => acc + t.text.split(/\s+/).filter(Boolean).length, 0),
    [transcripts]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-background text-text-primary font-sans selection:bg-primary/20 transition-colors duration-300">
      <Header
        isListening={isListening}
        isSupported={isSupported}
        error={error}
        onStart={startInterview}
        onStop={stopInterview}
      />

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Live Transcript */}
        <div className="w-1/2 min-w-[400px] flex flex-col">
          <TranscriptPanel
            transcripts={transcripts}
            interimText={interimText}
            isListening={isListening}
            isSupported={isSupported}
            onClear={clearTranscripts}
          />
        </div>

        {/* AI Summary & Fillers */}
        <div className="flex-1 min-w-[300px] flex flex-col">
          <SummaryPanel
            modelStatus={modelStatus}
            loadTime={tLoad}
            loadProgress={loadProgress}
            currentSummary={summary}
            lastLatency={latency}
            avgLatency={avgLat}
            processing={processing}
            lastPhrase={lastPhrase}
            phraseCount={phraseCount}
            isSpeaking={isSpeaking}
            ttsSupported={ttsOk}
          />
          
          <SummaryDebugPanel 
            processing={processing}
            lastLatency={latency}
            avgLatency={avgLat}
            transcriptCount={transcripts.length}
            modelStatus={modelStatus}
            currentSummary={summary}
          />
        </div>
      </main>

      <MetricsBar
        isListening={isListening}
        wordCount={wordCount}
        entryCount={transcripts.length}
        modelStatus={modelStatus}
        loadTime={tLoad}
        lastLatency={latency}
        avgLatency={avgLat}
        phraseCount={phraseCount}
      />

      <FillerDebugPanel
        debugInfo={debugInfo}
        lastPhrase={lastPhrase}
        isListening={isListening}
      />
    </div>
  );
}

export default App;
