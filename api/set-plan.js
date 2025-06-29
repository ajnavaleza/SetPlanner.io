const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Mock data for fallback when Spotify integration fails
const mockTracks = [
  {
    id: '1',
    name: 'Example Track 1',
    artist: 'Artist 1',
    duration: 3,
    popularity: 85,
    preview_url: 'https://example.com/preview1.mp3'
  },
  {
    id: '2',
    name: 'Example Track 2',
    artist: 'Artist 2',
    duration: 4,
    popularity: 75,
    preview_url: 'https://example.com/preview2.mp3'
  }
];

async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    return true;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return false;
  }
}

async function searchTracks(query, limit = 50) {
  try {
    const result = await spotifyApi.searchTracks(query, { limit });
    return result.body.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      duration: Math.round(track.duration_ms / 1000 / 60), // Convert to minutes
      preview_url: track.preview_url,
      popularity: track.popularity
    }));
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw new Error(`Failed to search tracks for query: ${query}`);
  }
}

async function searchArtists(artistName) {
  try {
    const result = await spotifyApi.searchArtists(artistName, { limit: 1 });
    return result.body.artists.items[0] || null;
  } catch (error) {
    console.error('Error searching artist:', error);
    return null;
  }
}

async function getArtistTopTracks(artistId) {
  try {
    const result = await spotifyApi.getArtistTopTracks(artistId, 'US');
    return result.body.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      duration: Math.round(track.duration_ms / 1000 / 60),
      preview_url: track.preview_url,
      popularity: track.popularity
    }));
  } catch (error) {
    console.error('Error getting artist top tracks:', error);
    return [];
  }
}

async function getRecommendations(seedArtists, seedGenres, limit = 50) {
  try {
    const recommendations = await spotifyApi.getRecommendations({
      seed_artists: seedArtists,
      seed_genres: seedGenres,
      limit: limit,
      min_energy: 0.3,
      max_energy: 0.9,
      min_danceability: 0.4,
      target_popularity: 50
    });

    return recommendations.body.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      duration: Math.round(track.duration_ms / 1000 / 60),
      preview_url: track.preview_url,
      popularity: track.popularity
    }));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get track recommendations');
  }
}

async function getRelatedArtists(artistId) {
  try {
    const result = await spotifyApi.getArtistRelatedArtists(artistId);
    return result.body.artists.slice(0, 3); // Get top 3 related artists
  } catch (error) {
    console.error('Error getting related artists:', error);
    return [];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function removeDuplicates(tracks) {
  const seen = new Set();
  return tracks.filter(track => {
    const key = `${track.name}-${track.artist}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { description, genre, referenceArtists, length } = req.body;
    
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    // Check if Spotify credentials are available and working
    const spotifyAvailable = await getAccessToken();
    
    if (!spotifyAvailable) {
      console.log('Spotify integration unavailable, using mock data');
      return res.status(200).json({
        plan: {
          genre,
          description,
          total_duration: length,
          tracks: mockTracks,
          enhanced: false
        }
      });
    }

    // Check if user is authenticated (has access token in cookies)
    const userAccessToken = req.cookies?.spotify_access_token;
    let isUserAuthenticated = false;

    if (userAccessToken) {
      try {
        // Set the user's access token
        spotifyApi.setAccessToken(userAccessToken);
        isUserAuthenticated = true;
        console.log('Using user authentication for enhanced recommendations');
      } catch (error) {
        console.log('User token invalid, falling back to client credentials');
        await getAccessToken(); // Fall back to client credentials
      }
    } else {
      console.log('No user authentication, using client credentials');
      await getAccessToken(); // Use client credentials
    }

    let allTracks = [];
    const usedTrackIds = new Set();

    // Step 1: Get tracks based on reference artists
    if (referenceArtists && referenceArtists.trim()) {
      try {
        const artistNames = referenceArtists.split(',').map(name => name.trim());
        
        if (isUserAuthenticated) {
          // Use recommendations API when user is authenticated
          const seedArtists = [];
          
          // Get artist IDs for recommendations
          for (const artistName of artistNames) {
            const artist = await searchArtists(artistName);
            if (artist && seedArtists.length < 5) { // Spotify allows max 5 seed artists
              seedArtists.push(artist.id);
            }
          }

          if (seedArtists.length > 0) {
            console.log(`Getting recommendations for artists: ${artistNames.join(', ')}`);
            const recommendedTracks = await getRecommendations(seedArtists, [genre.toLowerCase()], 50);
            
            recommendedTracks.forEach(track => {
              if (!usedTrackIds.has(track.id)) {
                allTracks.push(track);
                usedTrackIds.add(track.id);
              }
            });
            
            console.log(`Added ${recommendedTracks.length} recommended tracks`);
          }
        } else {
          // Use top tracks method when user is not authenticated
          for (const artistName of artistNames) {
            const artist = await searchArtists(artistName);
            if (artist) {
              console.log(`Getting top tracks for artist: ${artistName}`);
              
              // Get top tracks from the artist
              const topTracks = await getArtistTopTracks(artist.id);
              topTracks.forEach(track => {
                if (!usedTrackIds.has(track.id)) {
                  allTracks.push(track);
                  usedTrackIds.add(track.id);
                }
              });
              
              // If user is authenticated, also get related artists
              if (isUserAuthenticated) {
                const relatedArtists = await getRelatedArtists(artist.id);
                for (const relatedArtist of relatedArtists) {
                  const relatedTopTracks = await getArtistTopTracks(relatedArtist.id);
                  relatedTopTracks.forEach(track => {
                    if (!usedTrackIds.has(track.id)) {
                      allTracks.push(track);
                      usedTrackIds.add(track.id);
                    }
                  });
                }
              }
              
              console.log(`Added ${topTracks.length} tracks for ${artistName}`);
            }
          }
        }
      } catch (error) {
        console.error('Error getting artist tracks:', error);
        // Continue with genre search if artist search fails
      }
    }

    // Step 2: Get genre-based tracks as fallback or supplement
    if (allTracks.length < 30) {
      try {
        const searchQueries = [
          genre,
          `${genre} popular`,
          `${genre} trending`
        ];

        for (const query of searchQueries) {
          const tracks = await searchTracks(query, 20);
          
          tracks.forEach(track => {
            if (!usedTrackIds.has(track.id)) {
              allTracks.push(track);
              usedTrackIds.add(track.id);
            }
          });
        }
        
        console.log(`Added ${allTracks.length} total tracks from genre search`);
      } catch (error) {
        console.error('Error in genre search:', error);
      }
    }

    // Step 3: Remove duplicates and shuffle
    allTracks = removeDuplicates(allTracks);
    allTracks = shuffleArray(allTracks);

    if (allTracks.length === 0) {
      return res.status(404).json({ error: 'No tracks found for the specified genre and artists' });
    }

    // Step 4: Select tracks that fit within the requested length
    const selectedTracks = [];
    let currentDuration = 0;

    for (const track of allTracks) {
      if (currentDuration + track.duration <= length) {
        selectedTracks.push(track);
        currentDuration += track.duration;
      }
      
      if (currentDuration >= length) {
        break;
      }
    }

    const setplan = {
      genre,
      total_duration: currentDuration,
      description: description || `A ${genre} playlist${referenceArtists ? ` inspired by ${referenceArtists}` : ''}`,
      tracks: selectedTracks,
      enhanced: isUserAuthenticated // Indicate if enhanced features were used
    };

    console.log(`Generated playlist with ${selectedTracks.length} tracks, ${currentDuration} minutes total (${isUserAuthenticated ? 'enhanced' : 'basic'} mode)`);
    return res.status(200).json({ plan: setplan });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return res.status(500).json({ 
      error: 'Failed to generate set plan',
      details: error.message 
    });
  }
}

module.exports = { default: handler }; 