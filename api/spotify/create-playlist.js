import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = req.cookies.spotify_access_token;
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated with Spotify' });
  }

  try {
    const { name, description, tracks } = req.body;
    
    if (!name || !tracks || !Array.isArray(tracks)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    spotifyApi.setAccessToken(accessToken);

    // Get user's Spotify ID
    const me = await spotifyApi.getMe();
    
    // Create playlist
    const playlist = await spotifyApi.createPlaylist(me.body.id, {
      name,
      description,
      public: true
    });

    // Add tracks to playlist
    const trackUris = tracks.map(track => `spotify:track:${track.id}`);
    await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

    res.status(200).json({
      success: true,
      playlist: {
        id: playlist.body.id,
        url: playlist.body.external_urls.spotify,
        name: playlist.body.name
      }
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
} 