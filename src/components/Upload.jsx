import React, { useEffect, useState } from 'react';
import { parseBlob } from 'music-metadata-browser';
import Essentia from 'essentia.js/dist/essentia.js-core.es.js';
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';

// *** EXAMPLE UTILITY: shortens audio length and/or downsamples. ***
// You can put this in a separate "audioUtils.js" if you want a cleaner code structure.
function shortenFloat32Array(original, keepRatio = 0.15) {
  /**
   * keepRatio < 1.0 means we keep that % of the audio.
   * e.g., keepRatio=0.15 => keep ~15% of the samples (85% dropped).
   *
   * For example, this snippet just keeps the first [keepRatio * length] portion.
   * Or you could keep a middle chunk, random chunk, etc.
   */
  if (keepRatio <= 0) return new Float32Array();
  if (keepRatio >= 1) return original;

  const keepLength = Math.floor(original.length * keepRatio);
  // e.g. keep from 0 → keepLength
  return original.slice(0, keepLength);
}

/** Quick downsample from "currentRate" to "targetRate". */
function downsampleFloat32Array(original, currentRate, targetRate) {
  if (targetRate >= currentRate) return original;
  const ratio = currentRate / targetRate;
  const newLength = Math.floor(original.length / ratio);
  const output = new Float32Array(newLength);

  let offsetY = 0;
  for (let i = 0; i < newLength; i++) {
    // simple average approach
    const start = Math.floor(i * ratio);
    const end = Math.min(Math.floor((i + 1) * ratio), original.length);
    let sum = 0,
      count = 0;
    for (let j = start; j < end; j++) {
      sum += original[j];
      count++;
    }
    output[i] = count ? sum / count : 0;
    offsetY++;
  }
  return output;
}

/**
 * Initialize a single Essentia instance from the synchronous ES build.
 * If you prefer the async approach, that's also fine. In your code snippet,
 * you're combining "Essentia" + "EssentiaWASM" directly.
 */
let essentia = new Essentia(EssentiaWASM);

// If you needed to fetch a `.wasm` file, you'd do it differently, but the code snippet
// suggests you already have a working instance.

// Just a placeholder init; you might skip it if essential is already set:
async function initEssentia() {
  // If there's logic to load a separate .wasm, you'd do it here
  return essentia; // or do nothing if it's already constructed
}

/** Convert multi-channel AudioBuffer => single Float32Array. */
function toMono(audioBuffer) {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }
  const left = audioBuffer.getChannelData(0);
  const right = audioBuffer.getChannelData(1);
  const mixDown = new Float32Array(audioBuffer.length);
  for (let i = 0; i < audioBuffer.length; i++) {
    mixDown[i] = 0.5 * (left[i] + right[i]);
  }
  return mixDown;
}

/** Example key + BPM detection from your code. */
function computeKeyAndBpm(ess, floatArray) {
  const vectorSignal = ess.arrayToVector(floatArray);

  // KeyExtractor
  const keyData = ess.KeyExtractor(
    vectorSignal,
    true,     // HPCP
    4096,     // frame size
    4096,     // hop size
    12,       // bins/octave
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

  // BPM
  const bpmOut = ess.PercivalBpmEstimator(
    vectorSignal,
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
    bpm: bpmOut.bpm
  };
}

function Upload({ addTracks }) {
  const [essentiaReady, setEssentiaReady] = useState(false);
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioCtx();

  // On mount, confirm Essentia is good to go
  useEffect(() => {
    initEssentia()
      .then(() => {
        setEssentiaReady(true);
        console.log('Essentia is ready!');
      })
      .catch((err) => {
        console.error('Failed to initialize Essentia:', err);
      });
  }, []);

  /**
   * This function decodes the file, shortens it, and runs computeKey&Bpm
   */
  async function detectKeyAndBpm(file) {
    if (!essentiaReady || !essentia) {
      console.warn('Essentia not ready yet.');
      return { key: '', bpm: 0 };
    }
    // 1) decode with Web Audio
    const arrayBuffer = await file.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(arrayBuffer);

    // 2) downmix to mono
    let monoData = toMono(decoded);

    // 3) Optional: downsample from e.g. 44.1kHz → 16kHz for faster HPCP
    //    If your HPCP code expects 16k as in your example, do so:
    monoData = downsampleFloat32Array(monoData, decoded.sampleRate, 16000);

    // 4) Optional: shorten to keep only e.g. 15% of the track
    //    This drastically reduces HPCP + BPM calculation time.
    monoData = shortenFloat32Array(monoData, 0.2); 
    // e.g. keep 20% instead of 15%. Adjust to your preference.

    // 5) run Key + BPM
    return computeKeyAndBpm(essentia, monoData);
  }

  /**
   * The main event handler: parse ID3, call detectKeyAndBpm, unify results.
   */
  const handleFileUpload = async (evt) => {
    const files = Array.from(evt.target.files);

    const trackPromises = files.map(async (file) => {
      try {
        const metadata = await parseBlob(file);
        const { title, artist, album, bpm, key } = metadata.common || {};

        // 1) Essentia analysis
        const { bpm: eBpm, key: eKey } = await detectKeyAndBpm(file);

        // 2) Merge results
        const finalBpm = bpm || (eBpm ? Math.round(eBpm).toString() : '');
        const finalKey = key || eKey || '';

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

    addTracks(await Promise.all(trackPromises));
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
