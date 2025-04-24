import React from 'react';
import { parseBlob } from 'music-metadata-browser';
import detect from 'bpm-detective';

function Upload({ addTracks }) {
  // Reuse one AudioContext for all files
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioCtx();

  async function detectBPM(file) {
    // 1) Convert the file into an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // 2) Decode the audio data into an AudioBuffer
    const decodedData = await new Promise((resolve, reject) => {
      audioContext.decodeAudioData(arrayBuffer, resolve, reject);
    });

    // 3) Run BPM detection on the decoded AudioBuffer
    const bpm = detect(decodedData);
    console.log(`Detected BPM for ${file.name}: ${bpm}`);
    return bpm || undefined;
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Process each file: parse tags & detect BPM
    const trackPromises = files.map(async (file) => {
      try {
        // Extract ID3 tags + run BPM detection in parallel
        const [metadata, bpmFromAnalysis] = await Promise.all([
          parseBlob(file),
          detectBPM(file)
        ]);

        // Use ID3 BPM if present; otherwise, our detected BPM
        const { title, artist, album, bpm, key } = metadata.common;
        const finalBpm = bpm || (bpmFromAnalysis ? Math.round(bpmFromAnalysis).toString() : '');

        return {
          title: title || file.name,
          artist: artist || 'Unknown Artist',
          album: album || '',
          bpm: finalBpm,
          key: key || '',
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
