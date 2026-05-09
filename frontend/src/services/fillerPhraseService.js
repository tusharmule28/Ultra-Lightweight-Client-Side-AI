// Contextual filler engine. Uses keyword classification + pause intent.

const CATS = {
  INTRO: 'introduction',
  GREETING: 'greeting',
  BG: 'background',
  TECH: 'technical',
  PROJ: 'project',
  EXPLAIN: 'explanation',
  HESITATE: 'hesitation',
  TRANS: 'transition',
  CONF: 'confidence',
  NONE: 'neutral'
};

const TEMPLATES = {
  [CATS.INTRO]: [
    "Thanks for the introduction...",
    "That's a nice background overview...",
    "Interesting introduction...",
    "I appreciate you sharing your background...",
    "It's great to hear about your journey so far..."
  ],
  [CATS.GREETING]: [
    "Hello! It's a pleasure to meet you...",
    "Hi there, thanks for joining today...",
    "Good to have you here...",
    "Thanks for the warm greeting..."
  ],
  [CATS.BG]: [
    "That sounds like valuable experience...",
    "That's a strong learning journey...",
    "I see how your skills have evolved...",
    "That's an impressive academic background...",
    "It's interesting to see your progression in the field..."
  ],
  [CATS.TECH]: [
    "That's an efficient implementation approach...",
    "Interesting performance optimization...",
    "I see how you're balancing the trade-offs there...",
    "That's a robust system architecture choice...",
    "Interesting optimization strategy..."
  ],
  [CATS.PROJ]: [
    "That sounds like a practical real-world solution...",
    "That's a strong project architecture...",
    "I like how you've scoped that application...",
    "Interesting way to manage the development cycle...",
    "That sounds like a very impactful project..."
  ],
  [CATS.EXPLAIN]: [
    "That's a clear way to break down the concept...",
    "I follow your explanation of the logic...",
    "That's a helpful perspective on how it works...",
    "I appreciate the level of detail in your response...",
    "That makes the flow much easier to understand..."
  ],
  [CATS.HESITATE]: [
    "Take your time...",
    "That's a thoughtful consideration...",
    "No rush, I'm following your line of thought...",
    "It's good to be thorough with these details...",
    "I see you're weighing the options here..."
  ],
  [CATS.TRANS]: [
    "Interesting transition between concepts...",
    "I like how you're connecting these two areas...",
    "That's a smooth segue into the next part...",
    "I see how this leads into the broader system...",
    "That's a logical step forward in your explanation..."
  ],
  [CATS.CONF]: [
    "You sound very certain about that approach...",
    "That's a very confident and clear stance...",
    "I like the conviction in your reasoning...",
    "That's a very strong and definitive answer...",
    "I appreciate the clarity in your delivery..."
  ],
  [CATS.NONE]: [
    "I understand...",
    "That makes sense...",
    "I'm following you...",
    "Right, I see...",
    "Got it, please continue..."
  ]
};

const KEYWORDS = {
  [CATS.INTRO]: [
    "my name is", "let me introduce myself", "i am from", "currently", 
    "recently graduated", "my background", "born and raised", "living in"
  ],
  [CATS.GREETING]: [
    "hello", "hi", "good morning", "thank you", "good afternoon", "nice to meet you"
  ],
  [CATS.BG]: [
    "experience", "internship", "education", "university", "skills",
    "background", "career", "role", "position", "studied", "graduated"
  ],
  [CATS.TECH]: [
    "api", "backend", "architecture", "model", "inference", "onnx", "fastapi",
    "code", "database", "engineering", "stack", "performance", "memory", "thread", "async",
    "frontend", "react", "logic", "algorithm", "data", "server", "optimization"
  ],
  [CATS.PROJ]: [
    "built", "developed", "application", "project", "system", "product", "feature",
    "prototype", "launch", "user", "feedback", "team", "client", "work", "implementation"
  ],
  [CATS.EXPLAIN]: [
    "because", "explain", "reason", "why", "how", "so", "basically", "essentially",
    "means", "context", "purpose", "goal", "result", "outcome", "consequently"
  ],
  [CATS.HESITATE]: [
    "umm", "maybe", "probably", "i think", "possibly", "sort of", "kind of", "unsure",
    "actually", "well", "uhh", "honestly", "perhaps"
  ],
  [CATS.TRANS]: [
    "then", "next", "also", "besides", "furthermore", "moving on", "another thing",
    "secondly", "finally", "additionally", "moreover"
  ],
  [CATS.CONF]: [
    "definitely", "absolutely", "certainly", "sure", "clear", "obviously", "result",
    "success", "positive", "strong", "effective", "guaranteed", "confirmed"
  ]
};

class FillerSvc {
  constructor() {
    this.historySize = 5;
    this.history = [];
    this.lastUsed = 0;
    this.cooldown = 5000;
  }

  getFiller(transcript = "", pauseType = "thinking") {
    const now = Date.now();
    if (now - this.lastUsed < this.cooldown) {
      return null;
    }

    const context = this.extract(transcript);
    if (!context && pauseType === "thinking") return null;

    const cat = this.classify(context);
    
    let target = cat;
    if (pauseType === "hesitation") {
      target = CATS.HESITATE;
    } else if (pauseType === "transition" && cat === CATS.NONE) {
      target = CATS.TRANS;
    }

    const phrase = this.pick(target);
    
    if (phrase) {
      this.lastUsed = now;
      this.history.push(phrase);
      if (this.history.length > this.historySize) this.history.shift();
    }

    return { phrase, category: target, pauseType, timestamp: now };
  }

  classify(text) {
    if (!text) return CATS.NONE;

    const raw = text.toLowerCase();
    const scores = {};

    for (const [cat, words] of Object.entries(KEYWORDS)) {
      scores[cat] = 0;
      for (const word of words) {
        const weight = word.includes(" ") ? 2 : 1;
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = raw.match(regex);
        if (matches) scores[cat] += matches.length * weight;
      }
    }

    let top = CATS.NONE;
    let max = 0;

    for (const [cat, score] of Object.entries(scores)) {
      if (score > max) {
        max = score;
        top = cat;
      }
    }

    // avoid aggressive mapping for tech/proj
    if ((top === CATS.TECH || top === CATS.PROJ) && max < 2) return CATS.NONE;

    return max > 0 ? top : CATS.NONE;
  }

  extract(text) {
    if (!text) return "";
    let window = text.slice(-250).trim();
    return window.replace(/\b(\w+)\s+\1\b/gi, '$1'); // dedupe repeats
  }

  pick(cat) {
    const pool = TEMPLATES[cat] || TEMPLATES[CATS.NONE];
    const available = pool.filter(t => !this.history.includes(t));
    const items = available.length > 0 ? available : pool;
    return items[Math.floor(Math.random() * items.length)];
  }

  reset() {
    this.history = [];
    this.lastUsed = 0;
  }
}

export const fillerSvc = new FillerSvc();
export default FillerSvc;
