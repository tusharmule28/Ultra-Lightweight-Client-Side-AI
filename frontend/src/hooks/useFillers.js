// Hook to manage pause-triggered filler phrases + TTS.

import { useState, useEffect, useCallback, useRef } from 'react';
import { pauseSvc }  from '../services/pauseDetectionService';
import { fillerSvc } from '../services/fillerPhraseService';
import { ttsSvc }    from '../services/ttsService';

export const useFillers = ({ transcripts = [], isListening = false }) => {
  const [phrase, setPhrase] = useState(null);
  const [count, setCount] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [debug, setDebug] = useState({
    cat: 'none',
    type: 'none',
    at: null
  });

  const [ttsOk] = useState(() => ttsSvc.isAvailable());

  const onFiller = useCallback((e) => {
    const { type, text } = e.detail;
    const res = fillerSvc.getFiller(text, type);

    if (!res) return;

    // tts playback
    ttsSvc.speak(res.phrase, {
      onStart: () => setSpeaking(true),
      onEnd:   () => setSpeaking(false),
    });

    setPhrase(res.phrase);
    setCount(n => n + 1);
    setDebug({
      cat: res.category,
      type: res.pauseType,
      at: Date.now()
    });
  }, []);

  useEffect(() => {
    window.addEventListener('filler_needed', onFiller);
    return () => window.removeEventListener('filler_needed', onFiller);
  }, [onFiller]);

  useEffect(() => {
    if (isListening) {
      fillerSvc.reset();
      setCount(0);
      setPhrase(null);
      setDebug({ cat: 'none', type: 'none', at: null });
    } else {
      ttsSvc.cancel();
      pauseSvc.stop();
      setSpeaking(false);
    }
  }, [isListening]);

  return {
    phrase,
    count,
    speaking,
    ttsOk,
    debug
  };
};
