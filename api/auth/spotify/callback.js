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

  const { code, state, error } = req.query;
  
  // Debug logging
  console.log('Callback Debug:', {
    hasCode: !!code,
    hasState: !!state,
    error: error || 'none',
    redirectUri: getRedirectUri(),
    environment: process.env.NODE_ENV
  });

  // Check for Spotify error first
  if (error) {
    console.error('Spotify auth error:', error);
    return res.redirect('/?error=' + encodeURIComponent(error));
  }

  // Get state from cookie
  const storedState = req.cookies?.spotify_auth_state;
  console.log('State comparison:', {
    received: state,
    stored: storedState,
    cookies: req.cookies
  });

  // Validate state
  if (!state || !storedState || state !== storedState) {
    console.error('State validation failed:', {
      receivedState: state,
      storedState: storedState,
      match: state === storedState
    });
    return res.redirect('/?error=' + encodeURIComponent('state_mismatch'));
  }

  try {
    console.log('Exchanging code for tokens...');
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Token exchange successful');

    // Clear the state cookie and set the new tokens
    res.setHeader('Set-Cookie', [
      // Clear the state cookie
      'spotify_auth_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      // Set the access token with explicit security settings
      `spotify_access_token=${data.body.access_token}; `+
      `Path=/; `+
      `HttpOnly; `+
      `Secure; `+
      `SameSite=Lax; `+
      `Max-Age=${data.body.expires_in}`,
      // Set the refresh token with explicit security settings
      `spotify_refresh_token=${data.body.refresh_token}; `+
      `Path=/; `+
      `HttpOnly; `+
      `Secure; `+
      `SameSite=Lax`
    ]);

    // Redirect to the create page with success parameter
    res.redirect('/create?auth=success');
  } catch (error) {
    console.error('Token exchange error:', error);
    res.redirect('/?error=' + encodeURIComponent('invalid_token'));
  }
} 