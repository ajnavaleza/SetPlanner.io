import React, { useEffect, useState } from 'react';
import { parseBlob } from 'music-metadata-browser';

// If you have a single-file build you can import directly, do something like:
import EssentiaJS from 'essentia.js/dist/essentia-wasm.web.js';

// Or if you're loading Essentia globally, you'll call window.essentia.* instead.

// Example approach: dynamic "initEssentia" if single-file build requires a .WASM:
let essentiaInstance = null;

async function initEssentia() {
  if (essentiaInstance) return essentiaInstance;
  
  // If you're using a single-file build that self-initializes, you might do:
  // const wasmModule = await EssentiaJS.WASM(/* optional: { wasmBinary } */);
  // essentiaInstance = new EssentiaJS.Essentia(wasmModule);
  
  // If a global "window.essentia" is available from <script>:
  if (!window.essentia) {
    console.error('Global Essentia not found. Ensure your single-file build is loaded.');
    return null;
  }
  essentiaInstance = window.essentia;
  return essentiaInstance;
}

/** Convert multi-channel data to mono by averaging channels. */
function toMono(audioBuffer) {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }
  const left = audioBuffer.getChannelData(0);
  const right = audioBuffer.getChannelData(1);
  const length = audioBuffer.length;
  const mono = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    mono[i] = 0.5 * (left[i] + right[i]);
  }
  return mono;
}

/**
 * Perform Key + BPM detection using the same methods as your example:
 * KeyExtractor(...) and PercivalBpmEstimator(...).
 */
function computeKeyBpm(essentia, floatData) {
  const vector = essentia.arrayToVector(floatData);
  
  // Key extraction
  const keyData = essentia.KeyExtractor(
    vector,
    true,        // HPCP
    4096,        // frame size
    4096,        // hop size
    12,          // bins per octave
    3500,
    60,
    25,
    0.2,
    'bgate',
    16000,
    0.0001,
    440,
    'cosine',
    'hann'
  );

  // BPM extraction
  const bpmResult = essentia.PercivalBpmEstimator(
    vector,
    1024,
    2048,
    128,
    128,
    210,
    50,
    16000
  );

  return {
    key: `${keyData.key} ${keyData.scale}`.trim(),
    bpm: bpmResult.bpm 
  };
}

function Upload({ addTracks }) {
  const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextImpl();
  const [essLoaded, setEssLoaded] = useState(false);

  // Initialize Essentia once
  useEffect(() => {
    initEssentia().then((instance) => {
      if (instance) setEssLoaded(true);
    });
  }, []);

  /**
   * Convert the file to an ArrayBuffer, decode with Web Audio, then run Essentia's Key+BPM.
   */
  async function analyzeWithEssentia(file) {
    if (!essLoaded || !essentiaInstance) {
      console.warn('Essentia not loaded yet.');
      return { key: '', bpm: undefined };
    }
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Downmix if stereo
    const monoData = toMono(audioBuffer);

    // Now compute key & BPM
    const { key, bpm } = computeKeyBpm(essentiaInstance, monoData);
    return { key, bpm };
  }

  /**
   * The main handler: parse ID3, run Essentia for Key/BPM, then assemble track info.
   */
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    const trackPromises = files.map(async (file) => {
      try {
        const metadata = await parseBlob(file);
        const { title, artist, album, bpm, key } = metadata.common;
        
        // If ID3 doesn't have BPM/key, we do Essentia analysis
        const { bpm: analyzedBpm, key: analyzedKey } = await analyzeWithEssentia(file);

        // final BPM: prefer ID3 if present; else Essentia
        const finalBpm = bpm || (analyzedBpm ? Math.round(analyzedBpm).toString() : '');
        // final key: prefer ID3 if present; else Essentia
        const finalKey = key || analyzedKey || '';

        return {
          title: title || file.name,
          artist: artist || 'Unknown Artist',
          album: album || '',
          bpm: finalBpm,
          key: finalKey,
          file
        };
      } catch (error) {
        console.error('Error analyzing file:', error);
        return {
          title: file.name,
          artist: 'Unknown Artist',
          bpm: '',
          key: '',
          file
        };
      }
    });

    const newTracks = await Promise.all(trackPromises);
    addTracks(newTracks);
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <label>
        <strong>Upload MP3 Files: </strong>
        <input
          type="file"
          accept="audio/mp3"
          multiple
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}

export default Upload;
