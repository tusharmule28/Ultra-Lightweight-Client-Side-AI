import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.proxy = false;
// Let transformers handle WASM paths automatically unless it fails
// env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/';

class Pipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance = null;

  static promise = null;

  static async get(onProgress = null) {
    if (this.instance) return this.instance;
    if (this.promise) return this.promise;

    this.promise = (async () => {
      const start = performance.now();
      try {
        this.instance = await pipeline(this.task, this.model, {
          progress_callback: (p) => {
            if (onProgress) {
              onProgress({
                status: p.status,
                progress: p.progress,
                file: p.file,
                loaded: p.loaded,
                total: p.total
              });
            }
          },
          quantized: true, 
        });
        const loadTime = performance.now() - start;
        self.postMessage({ status: 'ready', loadTime });
        return this.instance;
      } catch (err) {
        this.promise = null; // allow retry
        self.postMessage({ status: 'error', error: err.message });
        throw err;
      }
    })();

    return this.promise;
  }
}

self.onmessage = async (e) => {
  const { id, text, type } = e.data;

  try {
    if (type === 'load') {
      await Pipeline.get(p => self.postMessage({ status: 'progress', progress: p }));
      return;
    }

    if (type === 'infer' && text) {
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
      return;
    }
  } catch (err) {
    console.error(`Worker: Error processing ${type}:`, err);
    self.postMessage({ id, status: 'error', error: err.message });
  }
};
