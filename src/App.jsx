import React, { useState } from 'react';
import Upload from './components/Upload';
import TrackList from './components/TrackList';

function App() {
  const [tracks, setTracks] = useState([]);

  // Handler to add new tracks to the global 'tracks' array
  const addTracks = (newTracks) => {
    setTracks((prev) => [...prev, ...newTracks]);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>SetPlanner.io</h1>
      <Upload addTracks={addTracks} />
      <TrackList tracks={tracks} setTracks={setTracks} />
    </div>
  );
}

export default App;
