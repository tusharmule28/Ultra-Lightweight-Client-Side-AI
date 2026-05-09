// Hook to manage model lifecycle and summarization loop.

import { useState, useEffect, useRef } from 'react';
import { summarySvc } from '../services/summarizerService';
import { splitIntoSentences } from '../utils/sentenceSplitter';

const DEBOUNCE = 400;
const WINDOW = 8; 
const SAMPLES = 10;

export const useSummarizer = ({ transcripts = [] }) => {
  const [status, setStatus] = useState('uninitialized');
  const [tLoad, setTLoad] = useState(null);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [latency, setLatency] = useState(null);
  const [avgLat, setAvgLat] = useState(null);
  const [busy, setBusy] = useState(false);

  const samples = useRef([]);

  // init model on mount
  useEffect(() => {
    setStatus('loading');
    summarySvc.init(
      (p) => {
        if (p?.progress !== undefined) setProgress(Math.round(p.progress));
      },
      (time) => {
        setStatus('ready');
        setTLoad(time);
      }
    );
  }, []);

  // summarization loop
  useEffect(() => {
    if (status !== 'ready' || transcripts.length === 0 || busy) return;

    const tid = setTimeout(async () => {
      // slice to last 20 for performance
      const text = transcripts.slice(-20).map(t => t.text).join(' ');
      const sentences = splitIntoSentences(text);

      if (sentences.length === 0) return;

      const window = sentences.slice(-WINDOW);

      if (window.length < 2) {
        setSummary(window[0]);
        return;
      }

      setBusy(true);
      try {
        const res = await summarySvc.summarize(window);
        
        if (res.summary) {
          setSummary(res.summary);
          setLatency(res.latency);

          samples.current.push(res.latency);
          if (samples.current.length > SAMPLES) samples.current.shift();
          
          const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;
          setAvgLat(avg);
        }
      } catch (err) {
        console.error('summarize hook failed:', err);
      } finally {
        setBusy(false);
      }
    }, DEBOUNCE);

    return () => clearTimeout(tid);
  }, [transcripts, status, busy]);

  return {
    status,
    tLoad,
    progress,
    summary,
    latency,
    avgLat,
    busy
  };
};
