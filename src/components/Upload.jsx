import React, { useEffect, useRef, useState } from 'react';
import { parseBlob } from 'music-metadata-browser';
import Essentia from 'essentia.js/dist/essentia.js-core.es.js';
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';
import { preprocess, shortenAudio } from '/src/audioUtils';

// Arbitrary fraction of the file to keep (example: 15%)
const KEEP_PERCENTAGE = 0.15;

// Create a single Essentia instance (synchronous build).
let essentia = new Essentia(EssentiaWASM);

async function initEssentia() {
  // If any custom WASM fetching is needed, do that here. Otherwise assume instant availability.
  return essentia;
}

/**
 * Perform Key & BPM detection at 16kHz, using HPCP + KeyExtractor + PercivalBpmEstimator.
 */
function computeKeyAndBpm(floatData) {
  const vector = essentia.arrayToVector(floatData);

  // Key extraction
  const keyRes = essentia.KeyExtractor(
    vector,
    true,
    4096,
    4096,
    12,
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
  const bpmRes = essentia.PercivalBpmEstimator(
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
    key: `${keyRes.key} ${keyRes.scale}`.trim(),
    bpm: bpmRes.bpm
  };
}

export default function Upload({ addTracks }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [essentiaReady, setEssentiaReady] = useState(false);

  // For drag & drop
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  // Single AudioContext
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioCtx();

  useEffect(() => {
    // Initialize Essentia once on mount
    initEssentia()
      .then(() => {
        setEssentiaReady(true);
        console.log('Essentia is ready for analysis.');
      })
      .catch((err) => {
        console.error('Failed to init Essentia:', err);
      });
  }, []);

  /**
   * Analyze a single file: decode -> preprocess -> shorten -> computeKeyAndBpm
   */
  async function analyzeFile(file) {
    if (!essentiaReady) {
      console.warn('Essentia not ready yet.');
      return { bpm: 0, key: '' };
    }
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 1) Downmix + downsample -> 16kHz
    const processed = preprocess(audioBuffer);
    // 2) Keep only a fraction of audio for faster analysis
    const partial = shortenAudio(processed, KEEP_PERCENTAGE, true);

    return computeKeyAndBpm(partial);
  }

  /**
   * Handle a batch of files, parse ID3, run Essentia, unify results in track objects.
   */
  async function handleFiles(files) {
    setIsAnalyzing(true);
    
    const trackPromises = files.map(async (file) => {
      try {
        // Parse ID3 tags if present
        const metadata = await parseBlob(file);
        const { title, artist, album, bpm, key } = metadata.common ?? {};

        // Essentia analysis
        const { bpm: eBpm, key: eKey } = await analyzeFile(file);

        // Final: prefer ID3 BPM/key if present; else use Essentia
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
      } catch (err) {
        console.error(`Error analyzing ${file.name}:`, err);
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

    setIsAnalyzing(false);
  }

  /**
   * File input "onChange" -> handle selected files.
   */
  const onFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) handleFiles(files);
  };

  /**
   * DRAG & DROP EVENT HANDLERS
   */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files);
  };

  /**
   * Make the drop zone clickable -> open hidden file input
   */
  const handleClickDropZone = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Hidden file input for fallback or manual selection */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/mp3"
        multiple
        style={{ display: 'none' }}
        onChange={onFileSelect}
      />

      {/* DRAG & DROP BOX */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClickDropZone}
        style={{
          border: '2px dashed #bbb',
          padding: '30px',
          textAlign: 'center',
          cursor: 'pointer',
          color: '#444'
        }}
      >
        <p style={{ margin: 0 }}>
          Drag & drop MP3 files here, or click to select.
        </p>
      </div>

      {/* Loading message while analyzing */}
      {isAnalyzing && (
        <p style={{ marginTop: '10px', color: 'orange', fontStyle: 'italic' }}>
          Analyzing track(s)... This may take a few seconds.
        </p>
      )}
    </div>
  );
}
