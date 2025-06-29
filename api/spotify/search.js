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

module.exports = async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    await ensureValidToken();

    const response = await spotifyApi.searchTracks(query, { limit: 5 });
    const tracks = response.body.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      albumArt: track.album.images[2]?.url || '',
    }));

    res.json({ tracks });
  } catch (error) {
    console.error('Spotify search error:', error);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
}; 