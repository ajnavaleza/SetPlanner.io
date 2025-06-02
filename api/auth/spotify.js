import SpotifyWebApi from 'spotify-web-api-node';

function getRedirectUri() {
  // If SPOTIFY_REDIRECT_URI is set, use it
  if (process.env.SPOTIFY_REDIRECT_URI) {
    return process.env.SPOTIFY_REDIRECT_URI;
  }
  
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/auth/spotify/callback`;
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
  
  // Log the state for debugging
  console.log('Generated state:', state);
  
  // Create the authorization URL with the state parameter
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  
  // Log the complete URL for debugging
  console.log('Redirect URL:', authorizeURL);
  
  // Ensure headers are sent before redirect
  res.status(302).redirect(authorizeURL);
} 