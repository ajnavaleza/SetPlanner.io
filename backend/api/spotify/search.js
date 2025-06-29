const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Token management
let tokenExpirationTime = 0;

async function ensureValidToken() {
  if (Date.now() > tokenExpirationTime) {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    // Set expiration time 5 minutes before actual expiration to be safe
    tokenExpirationTime = Date.now() + (data.body.expires_in - 300) * 1000;
  }
}

// Temporary mock search handler
module.exports = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // Return mock data
  const mockResults = [
    {
      id: '1',
      name: 'Example Song 1',
      artists: ['Artist 1'],
      album: 'Album 1',
      albumArt: 'https://via.placeholder.com/64'
    },
    {
      id: '2',
      name: 'Example Song 2',
      artists: ['Artist 2'],
      album: 'Album 2',
      albumArt: 'https://via.placeholder.com/64'
    }
  ];

  res.json(mockResults);
}; 