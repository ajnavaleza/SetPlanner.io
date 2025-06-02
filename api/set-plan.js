import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

async function getAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body['access_token']);
}

async function searchTracks(query, limit = 5) {
  const result = await spotifyApi.searchTracks(query, { limit });
  return result.body.tracks.items.map(track => ({
    name: track.name,
    artist: track.artists[0].name,
    duration: Math.round(track.duration_ms / 1000 / 60), // Convert to minutes
    preview_url: track.preview_url
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { description, genre, referenceArtists, length } = req.body;
    
    // Get Spotify access token
    await getAccessToken();

    // Calculate section durations
    const introLength = Math.round(length * 0.2);  // 20% of total length
    const buildLength = Math.round(length * 0.3);  // 30% of total length
    const peakLength = Math.round(length * 0.3);   // 30% of total length
    const outroLength = Math.round(length * 0.2);  // 20% of total length

    // Search for tracks for each section
    const [introTracks, buildTracks, peakTracks, outroTracks] = await Promise.all([
      searchTracks(`${genre} intro ${referenceArtists}`),
      searchTracks(`${genre} build up ${referenceArtists}`),
      searchTracks(`${genre} peak time ${referenceArtists}`),
      searchTracks(`${genre} outro ${referenceArtists}`)
    ]);

    const setplan = {
      genre,
      total_duration: length,
      description,
      sections: {
        intro: introTracks,
        build: buildTracks,
        peak: peakTracks,
        outro: outroTracks
      }
    };

    return res.status(200).json({ plan: setplan });
  } catch (error) {
    console.error('Error generating set plan:', error);
    return res.status(500).json({ error: 'Failed to generate set plan' });
  }
} 