import React, { useEffect, useRef, useState } from 'react';
import { parseBlob } from 'music-metadata-browser';
import Essentia from 'essentia.js/dist/essentia.js-core.es.js';
import { EssentiaWASM } from 'essentia.js/dist/essentia-wasm.es.js';
import { preprocess, shortenAudio } from '/src/audioUtils';

// Define a map from "note scale" (e.g. "C major") to Camelot notation (e.g. "8B").
const camelotMap = {
  'Ab minor': '1A',
  'Eb minor': '2A',
  'Bb minor': '3A',
  'F minor': '4A',
  'C minor': '5A',
  'G minor': '6A',
  'D minor': '7A',
  'A minor': '8A',
  'E minor': '9A',
  'B minor': '10A',
  'F# minor': '11A',
  'C# minor': '12A',

  'B major': '1B',
  'F# major': '2B',
  'C# major': '3B',
  'G# major': '4B',
  'D# major': '5B',
  'A# major': '6B',
  'F major': '7B',
  'C major': '8B',
  'G major': '9B',
  'D major': '10B',
  'A major': '11B',
  'E major': '12B'
};

const KEEP_PERCENTAGE = 0.15;
let essentia = new Essentia(EssentiaWASM);

async function initEssentia() {
  return essentia;
}

/**
 * Convert an Essentia "key" + "scale" into Camelot notation if possible.
 */
function toCamelotNotation(essKey, essScale) {
  const combined = `${essKey} ${essScale}`.trim(); // e.g. "B major"
  return camelotMap[combined] || combined; // fallback if not found in map
}

/**
 * HPCP-based Key + BPM extraction at 16kHz—returns { key: "X", bpm: N }.
 */
function computeKeyAndBpm(floatData) {
  const vector = essentia.arrayToVector(floatData);

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

  const camelot = toCamelotNotation(keyRes.key, keyRes.scale);

  return {
    key: camelot,
    bpm: bpmRes.bpm
  };
}

export default function Upload({ addTracks }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [essentiaReady, setEssentiaReady] = useState(false);

  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  // Single AudioContext
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioCtx();

  useEffect(() => {
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
   * Downmix + downsample + shorten → Key+BPM
   * Also returns the track’s full length in seconds from audioBuffer.duration.
   */
  async function analyzeFile(file) {
    if (!essentiaReady) {
      console.warn('Essentia not ready yet.');
      return { bpm: 0, key: '', length: 0 };
    }

    // 1) Decode audio
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 2) The track’s total length in seconds:
    const fullLength = Math.round(audioBuffer.duration);

    // 3) Preprocessing for HPCP
    const processed = preprocess(audioBuffer);
    const partial = shortenAudio(processed, KEEP_PERCENTAGE, true);
    const { key, bpm } = computeKeyAndBpm(partial);

    return { key, bpm, length: fullLength };
  }

  /**
   * Handle one or more files: parse ID3 + Essentia analysis, then combine results.
   */
  async function handleFiles(files) {
    setIsAnalyzing(true);

    const trackPromises = files.map(async (file) => {
      try {
        // Parse ID3
        const metadata = await parseBlob(file);
        const { title, artist, album, bpm, key } = metadata.common ?? {};

        // HPCP + BPM + song length
        const { bpm: eBpm, key: eKey, length: trackLength } = await analyzeFile(file);

        // prefer ID3 BPM if present
        const finalBpm = bpm || (eBpm ? Math.round(eBpm).toString() : '');
        // always use Essentia's Camelot if you want
        const finalKey = eKey || key || '';

        return {
          title: title || file.name,
          artist: artist || 'Unknown Artist',
          album: album || '',
          bpm: finalBpm,
          key: finalKey,
          length: trackLength,  // store track length in seconds
          file
        };
      } catch (err) {
        console.error(`Error analyzing ${file.name}:`, err);
        return {
          title: file.name,
          artist: 'Unknown Artist',
          bpm: '',
          key: '',
          length: 0,
          file
        };
      }
    });

    const newTracks = await Promise.all(trackPromises);
    addTracks(newTracks);

    setIsAnalyzing(false);
  }

  const onFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files);
  };

  const handleClickDropZone = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/mp3"
        multiple
        style={{ display: 'none' }}
        onChange={onFileSelect}
      />

      {/* Drag & Drop box */}
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
