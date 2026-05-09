// ONNX worker for sentence embeddings.
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1;

class Pipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance = null;

  static async get(onProgress = null) {
    if (!this.instance) {
      const start = performance.now();
      this.instance = await pipeline(this.task, this.model, {
        progress_callback: onProgress,
        quantized: true, 
      });
      self.postMessage({ status: 'ready', loadTime: performance.now() - start });
    }
    return this.instance;
  }
}

self.onmessage = async (e) => {
  const { id, text, type } = e.data;

  if (type === 'load') {
    try {
      await Pipeline.get(p => self.postMessage({ status: 'progress', progress: p }));
    } catch (err) {
      self.postMessage({ status: 'error', error: err.message });
    }
    return;
  }

  if (type === 'infer' && text) {
    try {
      const model = await Pipeline.get();
      const start = performance.now();
      
      const out = await model(text, {
        pooling: 'mean',
        normalize: true,
      });

      self.postMessage({
        id,
        status: 'complete',
        result: Array.from(out.data),
        latency: performance.now() - start,
      });
    } catch (err) {
      self.postMessage({ id, status: 'error', error: err.message });
    }
  }
};
