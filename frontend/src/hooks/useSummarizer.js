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
  const [error, setError] = useState(null);

  const samples = useRef([]);

  // init model on mount
  useEffect(() => {
    setStatus('loading');
    setError(null);
    summarySvc.init(
      (p) => {
        if (p?.progress !== undefined) setProgress(Math.round(p.progress));
      },
      (time) => {
        setStatus('ready');
        setTLoad(time);
      },
      (err) => {
        setStatus('error');
        setError(err);
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

      // If we have very few sentences, just show the latest long one
      if (window.length < 2) {
        if (window[0].length > 10) setSummary(window[0]);
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
        } else {
          // Fallback: if summarize returns null (due to word count filter), 
          // show the last sentence if it's substantial
          const last = window[window.length - 1];
          if (last.length > 20) setSummary(last);
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
    busy,
    error
  };
};
