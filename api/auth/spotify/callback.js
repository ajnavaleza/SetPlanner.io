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

  const { code, state, error } = req.query;
  const storedState = req.cookies.spotify_auth_state;

  if (error) {
    return res.redirect('/?error=' + encodeURIComponent(error));
  }

  if (!state || state !== storedState) {
    return res.redirect('/?error=' + encodeURIComponent('state_mismatch'));
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    // Set cookies with tokens
    res.setHeader('Set-Cookie', [
      `spotify_access_token=${data.body.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${data.body.expires_in}`,
      `spotify_refresh_token=${data.body.refresh_token}; Path=/; HttpOnly; SameSite=Lax`
    ]);

    res.redirect('/create');
  } catch (error) {
    console.error('Error getting Spotify tokens:', error);
    res.redirect('/?error=' + encodeURIComponent('invalid_token'));
  }
} 