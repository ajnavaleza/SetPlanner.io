// src/essentia.js (or any file name you prefer)
import EssentiaJS from './lib/essentia-wasm.web.js';

async function loadEssentia() {
  // If the build supports the '.WASM()' method:
  const wasmModule = await EssentiaJS.WASM();
  const instance = new EssentiaJS.Essentia(wasmModule);
  return instance;
}

export default loadEssentia;
