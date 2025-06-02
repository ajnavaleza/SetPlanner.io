import SpotifyWebApi from 'spotify-web-api-node';

function getRedirectUri() {
  // For production (Vercel deployment)
  if (process.env.NODE_ENV === 'production') {
    return 'https://set-planner-io.vercel.app/api/auth/spotify/callback';
  }
  
  // For local development
  return 'http://localhost:3000/api/auth/spotify/callback';
}

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: getRedirectUri()
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const scopes = ['playlist-modify-public', 'playlist-modify-private'];
  const state = Math.random().toString(36).substring(7);
  
  // Set a more secure cookie with explicit settings
  res.setHeader('Set-Cookie', [
    `spotify_auth_state=${state}; `+
    `Path=/; `+
    `HttpOnly; `+
    `Secure; `+
    `SameSite=Lax; `+
    `Max-Age=3600`
  ]);
  
  // Log the state and redirect URI for debugging
  console.log('Auth Debug:', {
    state,
    redirectUri: getRedirectUri(),
    environment: process.env.NODE_ENV
  });
  
  // Create the authorization URL with the state parameter
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  
  // Ensure headers are sent before redirect
  res.status(302).redirect(authorizeURL);
} 