import { computeCentroid, cosineSimilarity } from '../utils/similarity';

class SummarySvc {
  constructor() {
    this.worker = null;
    this.callbacks = new Map();
    this.id = 0;
    this.ready = false;
    this.onProgress = null;
    this.onReady = null;
    this.onError = null;
    this.loadTime = null;

    // Cache embeddings to avoid redundant WASM calls
    this.cache = new Map();
  }

  init(onProgress = null, onReady = null, onError = null) {
    this.onProgress = onProgress;
    this.onReady = onReady;
    this.onError = onError;

    if (this.ready) {
      this.onReady?.(this.loadTime);
      return;
    }

    if (this.worker) return;

    this.worker = new Worker(
      new URL('../workers/embeddingWorker.js', import.meta.url),
      { type: 'module' }
    );

    this.worker.addEventListener('message', (e) => {
      const { id, status, result, latency, progress, loadTime, error } = e.data;

      switch (status) {
        case 'ready':
          this.ready = true;
          this.loadTime = loadTime;
          this.onReady?.(loadTime);
          break;
        case 'progress':
          this.onProgress?.(progress);
          break;
        case 'complete':
          if (this.callbacks.has(id)) {
            const { resolve } = this.callbacks.get(id);
            resolve({ vector: result, latency });
            this.callbacks.delete(id);
          }
          break;
        case 'error':
          console.error('SummarySvc: worker error:', error);
          this.onError?.(error);
          if (id != null && this.callbacks.has(id)) {
            this.callbacks.get(id).reject(new Error(error));
            this.callbacks.delete(id);
          }
          break;
      }
    });

    this.worker.postMessage({ type: 'load' });
  }

  async getEmbedding(text) {
    if (this.cache.has(text)) {
      return { vector: this.cache.get(text), latency: 0 };
    }

    if (!this.worker) this.init();

    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, {
        resolve: ({ vector, latency }) => {
          this.cache.set(text, vector);
          resolve({ vector, latency });
        },
        reject
      });
      this.worker.postMessage({ id: msgId, type: 'infer', text });
    });
  }

  async summarize(sentences) {
    if (!sentences?.length) return { summary: null, latency: 0 };
    
    // clean fragments
    const clean = sentences
      .map(s => s.trim())
      .filter(s => s.length > 5 && s.split(/\s+/).length >= 3);

    if (clean.length === 0) return { summary: null, latency: 0 };
    if (clean.length === 1) return { summary: clean[0], latency: 0 };

    const start = performance.now();

    try {
      const embeddings = await Promise.all(clean.map(s => this.getEmbedding(s)));
      const vectors = embeddings.map(e => e.vector);
      const centroid = computeCentroid(vectors);

      const ranked = clean
        .map((s, i) => ({
          s,
          score: cosineSimilarity(vectors[i], centroid),
        }))
        .sort((a, b) => b.score - a.score);

      return {
        summary: ranked[0].s,
        latency: performance.now() - start,
      };
    } catch (err) {
      console.error('summarize failed:', err);
      return { summary: null, latency: 0 };
    }
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.callbacks.forEach(({ reject }) => reject(new Error('destroyed')));
    this.callbacks.clear();
    this.ready = false;
  }

  clear() {
    this.cache.clear();
  }
}

export const summarySvc = new SummarySvc();
export default SummarySvc;
