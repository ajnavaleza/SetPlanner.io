import React, { useState } from 'react';

export default function CreateSetPlan() {
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [referenceArtists, setReferenceArtists] = useState('');
  const [length, setLength] = useState(60);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [savingToSpotify, setSavingToSpotify] = useState(false);
  const [spotifySuccess, setSpotifySuccess] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedPlan(null);
    setError(null);

    try {
      if (!genre) {
        throw new Error('Please enter a genre');
      }

      const res = await fetch('/api/set-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, genre, referenceArtists, length })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || `HTTP error! status: ${res.status}`);
      }
      
      setGeneratedPlan(data.plan);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToSpotify = async () => {
    if (!generatedPlan) return;

    setSavingToSpotify(true);
    setSpotifySuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/spotify/create-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${genre} DJ Set - ${new Date().toLocaleDateString()}`,
          description: description || `A ${length}-minute ${genre} DJ set created with SetPlanner.io`,
          tracks: generatedPlan.tracks
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Redirect to Spotify auth if not authenticated
          window.location.href = '/api/auth/spotify';
          return;
        }
        throw new Error(data.error || 'Failed to create playlist');
      }

      setSpotifySuccess(data.playlist);
    } catch (err) {
      console.error('Error saving to Spotify:', err);
      setError(err.message);
    } finally {
      setSavingToSpotify(false);
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

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2 font-medium">Genre *</label>
            <input
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              placeholder="Case sensitive, comma-separated genre names (e.g., Tech House, Progressive, Drum & Bass)"
              value={genre}
              onChange={e => setGenre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Description (Optional)</label>
            <textarea
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              rows="3"
              placeholder="Describe the vibe or story of your set..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Reference Artists (Optional)</label>
            <input
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              placeholder="Case sensitive, comma-separated artist names (e.g., The Weeknd, Calvin Harris, Kygo)"
              value={referenceArtists}
              onChange={e => setReferenceArtists(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Set Length: {length} min</label>
            <input
              type="range"
              min="30"
              max="180"
              value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <button
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerate}
            disabled={loading || !genre.trim()}
          >
            {loading ? 'Generating...' : 'Generate Set Plan'}
          </button>
        </div>

        {generatedPlan && (
          <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">🎶 Your DJ Set Plan</h2>
              <button
                onClick={handleSaveToSpotify}
                disabled={savingToSpotify}
                className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] transition-colors rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingToSpotify ? 'Saving...' : 'Save to Spotify'}
              </button>
            </div>
            
            {spotifySuccess && (
              <div className="mb-6 p-4 bg-[#1DB954]/20 border border-[#1DB954] rounded-lg">
                <p className="text-[#1DB954] mb-2">Successfully created Spotify playlist!</p>
                <a 
                  href={spotifySuccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#1DB954] transition-colors"
                >
                  Open playlist in Spotify →
                </a>
              </div>
            )}

            <div className="mb-4">
              <p className="text-gray-400">Genre: {generatedPlan.genre}</p>
              <p className="text-gray-400">Duration: {generatedPlan.total_duration} minutes</p>
              {generatedPlan.description && (
                <p className="text-gray-400 mb-4">{generatedPlan.description}</p>
              )}
            </div>

            <div className="space-y-4">
              {generatedPlan.tracks.map((track, index) => (
                <div key={track.id} className="p-4 bg-gray-800 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{index + 1}.</span>
                        <h4 className="font-semibold">{track.name}</h4>
                      </div>
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
