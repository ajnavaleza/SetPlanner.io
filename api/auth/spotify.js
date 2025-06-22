const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate a random state for security
    const state = Math.random().toString(36).substring(7);
    
    // Create the authorization URL
    const authorizeURL = spotifyApi.createAuthorizeURL([
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-private',
      'user-read-email'
    ], state);
    
    // Redirect to Spotify authorization
    res.redirect(authorizeURL);
  } catch (error) {
    console.error('Error creating authorization URL:', error);
    res.status(500).json({ error: 'Failed to create authorization URL' });
  }
}

module.exports = { default: handler }; 