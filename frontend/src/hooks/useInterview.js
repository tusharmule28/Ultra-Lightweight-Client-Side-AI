// Orchestrates the interview session using Web Speech API.

import { useState, useRef, useCallback, useEffect } from 'react';
import { createSpeechSvc, isSpeechSupported } from '../services/speechService';
import { pauseSvc } from '../services/pauseDetectionService';

const getTs = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

let count = 0;
const genId = () => `t-${Date.now()}-${++count}`;

export const useInterview = () => {
  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [interim, setInterim] = useState('');

  const svc = useRef(null);
  const supported = isSpeechSupported();

  const onResult = useCallback((text, isFinal) => {
    // track every result for pause detection
    pauseSvc.track(text, isFinal);

    if (isFinal) {
      const val = text.trim();
      if (!val) return;

      setTranscripts(prev => [
        ...prev,
        { id: genId(), text: val, time: getTs(), isFinal: true },
      ]);
      setInterim('');
    } else {
      setInterim(text);
    }
  }, []);

  const onErr = useCallback((msg) => {
    setError(msg);
    setActive(false);
  }, []);

  const onStart = useCallback(() => {
    setActive(true);
    setError(null);
  }, []);

  const onEnd = useCallback(() => {
    if (!svc.current) setActive(false);
  }, []);

  const start = useCallback(() => {
    if (!supported) {
      setError('Speech API not supported.');
      return;
    }
    if (svc.current) return;

    setError(null);
    setInterim('');

    svc.current = createSpeechSvc({
      onResult,
      onError: onErr,
      onStart,
      onEnd,
    });

    svc.current?.start();
  }, [supported, onResult, onErr, onStart, onEnd]);

  const stop = useCallback(() => {
    svc.current?.stop();
    svc.current = null;
    setActive(false);
    setInterim('');
    pauseSvc.stop();
  }, []);

  const clear = useCallback(() => {
    setTranscripts([]);
    setInterim('');
  }, []);

  useEffect(() => {
    return () => {
      svc.current?.abort();
      svc.current = null;
      pauseSvc.stop();
    };
  }, []);

  return {
    isListening: active,
    isSupported: supported,
    error,
    transcripts,
    interimText: interim,
    startInterview: start,
    stopInterview: stop,
    clearTranscripts: clear,
  };
};
