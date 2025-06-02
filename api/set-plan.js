import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw new Error('Failed to authenticate with Spotify');
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
      preview_url: track.preview_url
    }));
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw new Error(`Failed to search tracks for query: ${query}`);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received request body:', req.body);
    
    const { description, genre, referenceArtists, length } = req.body;
    
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }

    console.log('Checking Spotify credentials:', {
      hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
      hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET
    });

    await getAccessToken();

    // Search for tracks with different queries to get variety
    const searchQueries = [
      `${genre} ${referenceArtists}`,
      genre,
      referenceArtists ? referenceArtists : genre
    ];

    const allTracks = [];
    const usedTrackIds = new Set();

    // Get tracks from each search query
    for (const query of searchQueries) {
      const tracks = await searchTracks(query);
      
      // Only add tracks that haven't been used yet
      tracks.forEach(track => {
        if (!usedTrackIds.has(track.id)) {
          allTracks.push(track);
          usedTrackIds.add(track.id);
        }
      });
    }

    // Shuffle the tracks for randomness
    const shuffledTracks = shuffleArray([...allTracks]);

    // Select tracks that fit within the requested length
    const selectedTracks = [];
    let currentDuration = 0;

    for (const track of shuffledTracks) {
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
      description,
      tracks: selectedTracks
    };

    console.log('Successfully generated setplan');
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