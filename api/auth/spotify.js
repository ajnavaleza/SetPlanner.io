import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/auth/spotify/callback` : 'http://localhost:3000/api/auth/spotify/callback'
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const scopes = ['playlist-modify-public', 'playlist-modify-private'];
  const state = Math.random().toString(36).substring(7);
  
  // Store state in cookie for validation
  res.setHeader('Set-Cookie', `spotify_auth_state=${state}; Path=/; HttpOnly; SameSite=Lax`);
  
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
} 