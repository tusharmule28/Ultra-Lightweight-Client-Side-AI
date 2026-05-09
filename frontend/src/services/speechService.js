// Web Speech API wrapper for continuous transcription.

export const isSpeechSupported = () => {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
};

export const createSpeechSvc = ({ onResult, onError, onStart, onEnd } = {}) => {
  if (!isSpeechSupported()) {
    onError?.('Speech API not supported. Use Chrome or Edge.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let active = false;
  let timer = null;

  recognition.onstart = () => onStart?.();

  recognition.onresult = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      onResult?.(res[0].transcript, res.isFinal);
    }
  };

  recognition.onerror = (e) => {
    if (e.error === 'no-speech' || e.error === 'aborted') return;

    const msgs = {
      'not-allowed': 'Microphone access denied.',
      'audio-capture': 'No microphone found.',
      'network': 'Network error in speech service.',
      'service-not-allowed': 'Speech service not allowed. Use HTTPS.',
    };

    onError?.(msgs[e.error] ?? `Error: ${e.error}`);
  };

  recognition.onend = () => {
    onEnd?.();
    // browser auto-stops after silence, so restart if active
    if (active) {
      timer = setTimeout(() => {
        if (active) {
          try { recognition.start(); } catch (_) {}
        }
      }, 300);
    }
  };

  return {
    start: () => {
      active = true;
      try { recognition.start(); } catch (_) {}
    },
    stop: () => {
      active = false;
      clearTimeout(timer);
      recognition.stop();
    },
    abort: () => {
      active = false;
      clearTimeout(timer);
      recognition.abort();
    }
  };
};
