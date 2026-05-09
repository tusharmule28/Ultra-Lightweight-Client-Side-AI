// Browser TTS wrapper.

class TTSSvc {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.speaking = false;
  }

  speak(text, { onStart, onEnd, rate = 1.0, pitch = 1.0, volume = 0.9 } = {}) {
    if (!this.supported || !text) return false;

    this.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    msg.rate = rate;
    msg.pitch = pitch;
    msg.volume = volume;

    // Pick best English voice
    const voices = this.synth.getVoices();
    const voice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (voice) msg.voice = voice;

    msg.onstart = () => {
      this.speaking = true;
      onStart?.();
    };

    msg.onend = msg.onerror = () => {
      this.speaking = false;
      onEnd?.();
    };

    this.synth.speak(msg);
    return true;
  }

  cancel() {
    if (!this.supported) return;
    this.synth.cancel();
    this.speaking = false;
  }

  isAvailable() {
    return this.supported;
  }
}

export const ttsSvc = new TTSSvc();
export default TTSSvc;
