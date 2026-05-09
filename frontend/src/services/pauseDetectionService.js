// Simple pause detection to trigger fillers.
// Detects thinking vs transition vs hesitation.

class PauseSvc {
  constructor(opts = {}) {
    this.timeout = opts.timeout || 2000;
    this.onTrigger = opts.onTrigger || null;
    this.timer = null;
    this.lastSpeech = 0;
    this.triggered = false;
    this.text = "";
  }

  track(transcript = "", isFinal = false) {
    this.text = transcript;
    this.lastSpeech = Date.now();
    this.triggered = false;

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.handlePause(isFinal), this.timeout);
  }

  handlePause(isFinal) {
    if (this.triggered) return;
    if (this.text.length < 10) return;

    this.triggered = true;
    const type = this.getType(this.text);

    const detail = {
      duration: Date.now() - this.lastSpeech,
      type,
      text: this.text,
      timestamp: Date.now()
    };

    window.dispatchEvent(new CustomEvent('filler_needed', { detail }));
    if (this.onTrigger) this.onTrigger(detail);
  }

  getType(transcript) {
    if (!transcript) return "thinking";

    const clean = transcript.trim();
    const lastChar = clean.slice(-1);
    const words = clean.toLowerCase().split(/\s+/).slice(-3);

    const hesitate = ["umm", "err", "maybe", "probably", "i think", "uhh", "like"];
    if (words.some(w => hesitate.includes(w))) return "hesitation";

    if ([".", "?", "!"].includes(lastChar)) return "transition";

    return "thinking";
  }

  stop() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.triggered = false;
  }
}

export const pauseSvc = new PauseSvc();
export default PauseSvc;
