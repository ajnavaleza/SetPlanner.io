import React, { useState } from 'react';

export default function CreateSetPlan() {
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [referenceArtists, setReferenceArtists] = useState('');
  const [length, setLength] = useState(60);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedPlan(null);

    try {
      const res = await fetch('/api/set-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ description, genre, referenceArtists, length })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setGeneratedPlan(data.plan);
    } catch (err) {
      console.error('Error details:', err);
      setGeneratedPlan(null);
      alert(`Error generating plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTrackList = (tracks) => {
    if (!tracks || tracks.length === 0) return null;
    
    return tracks.map((track, index) => (
      <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{track.name}</h4>
            <p className="text-gray-400">{track.artist}</p>
          </div>
          <span className="text-sm text-gray-400">{track.duration}min</span>
        </div>
        {track.preview_url && (
          <audio controls className="mt-2 w-full" src={track.preview_url}>
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">🎧 Design Your Perfect Set</h1>

        <textarea
          className="w-full p-3 mb-6 rounded bg-gray-800 border border-gray-700"
          rows="3"
          placeholder="Describe the vibe or story of your set..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          className="w-full p-3 mb-6 rounded bg-gray-800 border border-gray-700"
          placeholder="e.g., Tech House, Progressive, Drum & Bass"
          value={genre}
          onChange={e => setGenre(e.target.value)}
        />

        <input
          className="w-full p-3 mb-6 rounded bg-gray-800 border border-gray-700"
          placeholder="Comma-separated artist names"
          value={referenceArtists}
          onChange={e => setReferenceArtists(e.target.value)}
        />

        <label className="block text-sm mb-2 font-medium">Set Length: {length} min</label>
        <input
          type="range"
          min="30"
          max="180"
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          className="w-full mb-6"
        />

        <button
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Set Plan'}
        </button>

        {generatedPlan && (
          <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">🎶 Your DJ Set Plan</h2>
            
            <div className="mb-4">
              <p className="text-gray-400">Genre: {generatedPlan.genre}</p>
              <p className="text-gray-400">Duration: {generatedPlan.total_duration} minutes</p>
              <p className="text-gray-400 mb-4">{generatedPlan.description}</p>
            </div>

            <div className="space-y-6">
              {generatedPlan.sections.intro.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">🌅 Intro</h3>
                  {renderTrackList(generatedPlan.sections.intro)}
                </div>
              )}

              {generatedPlan.sections.build.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">📈 Build</h3>
                  {renderTrackList(generatedPlan.sections.build)}
                </div>
              )}

              {generatedPlan.sections.peak.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">🔥 Peak</h3>
                  {renderTrackList(generatedPlan.sections.peak)}
                </div>
              )}

              {generatedPlan.sections.outro.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">🌙 Outro</h3>
                  {renderTrackList(generatedPlan.sections.outro)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
