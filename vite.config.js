import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [react(), wasm()],

  resolve: {
    alias: {
      // Make sure the 'buffer' package is used wherever Node's Buffer is referenced
      buffer: 'buffer'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Enable global polyfills
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
});
