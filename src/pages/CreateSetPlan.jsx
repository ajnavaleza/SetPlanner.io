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

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">🎵 Create Your Playlist</h1>

        {/* Spotify Login Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">🎧 Enhanced with Spotify</h3>
              <p className="text-white/90 text-sm">
                Login to Spotify for AI-powered recommendations and save playlists directly to your account
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/api/auth/spotify'}
              className="px-6 py-3 bg-white text-[#1DB954] hover:bg-gray-100 transition-colors rounded-full font-semibold flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Login to Spotify
            </button>
          </div>
        </div>

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
              placeholder="Describe the vibe or mood of your playlist..."
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
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Adding reference artists helps find tracks that are similar in style and vibe to your favorite artists.
              {!generatedPlan?.enhanced && (
                <span className="text-blue-400"> Login to Spotify for enhanced AI recommendations!</span>
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Playlist Length: {length} min</label>
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
            {loading ? 'Generating...' : 'Generate Playlist'}
          </button>
        </div>

        {generatedPlan && (
          <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">🎶 Your Playlist</h2>
              <div className="flex gap-2">
                {!generatedPlan.enhanced && (
                  <button
                    onClick={() => window.location.href = '/api/auth/spotify'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full font-medium"
                  >
                    Login for Enhanced Features
                  </button>
                )}
                <button
                  onClick={handleSaveToSpotify}
                  disabled={savingToSpotify}
                  className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] transition-colors rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingToSpotify ? 'Saving...' : 'Save to Spotify'}
                </button>
              </div>
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
              {generatedPlan.enhanced ? (
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <span>✨</span>
                  <span className="text-sm">Enhanced recommendations used</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                  <span>ℹ️</span>
                  <span className="text-sm">Basic mode - Login to Spotify for enhanced AI recommendations</span>
                </div>
              )}
            </div>

            {/* Track List */}
            <div className="space-y-4">
              {generatedPlan.tracks.map((track, index) => (
                <div key={track.id} className="p-4 bg-gray-800 rounded">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500">{index + 1}.</span>
                      </div>
                      <h4 className="font-semibold text-lg">{track.name}</h4>
                      <p className="text-gray-400">{track.artist}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-sm text-gray-400">{track.duration}min</span>
                      {track.popularity && (
                        <div className="text-xs text-gray-500 mt-1">
                          Popularity: {track.popularity}%
                        </div>
                      )}
                    </div>
                  </div>
                  {track.preview_url && (
                    <audio controls className="mt-3 w-full" src={track.preview_url}>
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
