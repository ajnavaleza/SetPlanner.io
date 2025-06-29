const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Mock data for fallback
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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
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

    // For now, return mock data even if Spotify is available
    // We'll implement the full Spotify integration later
    return res.status(200).json({
      plan: {
        genre,
        description,
        total_duration: length,
        tracks: mockTracks,
        enhanced: false
      }
    });

  } catch (error) {
    console.error('Error generating set plan:', error);
    res.status(500).json({ error: 'Failed to generate set plan' });
  }
} 