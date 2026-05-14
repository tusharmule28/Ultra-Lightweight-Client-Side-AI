import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  worker: {
    format: 'es',
  },

  build: {
    target: 'esnext',
  },

  // ── Dependency optimisation ────────────────────────────────────────────────
  // Exclude @xenova/transformers AND onnxruntime-web from Vite's esbuild
  // pre-bundling. Both ship their own WASM assets and internal worker files
  // that must be served as raw files — esbuild re-bundling corrupts the paths.
  //
  // NOTE: COOP/COEP headers are intentionally NOT set here.
  // Those headers are only required when using multi-threaded WASM
  // (SharedArrayBuffer). Our embeddingWorker.js sets numThreads = 1, so
  // SharedArrayBuffer is not needed. Setting COEP: require-corp would block
  // ONNX Runtime's WASM file loading and cause the registerBackend error.
  optimizeDeps: {
    exclude: ['@xenova/transformers', 'onnxruntime-web'],
  },
});
