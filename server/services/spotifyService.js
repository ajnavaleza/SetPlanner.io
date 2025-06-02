import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Default genres if Spotify's genre list is unavailable
const DEFAULT_GENRES = ['electronic', 'dance', 'house'];

async function getRecommendations(accessToken, params) {
  try {
    const queryParams = new URLSearchParams();
    
    if (!params.seed_artists) {
      throw new Error('seed_artists parameter is required');
    }
    queryParams.append('seed_artists', params.seed_artists);
    
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }

    // Add tunable attributes
    const tunableParams = [
      'target_danceability', 'min_danceability',
      'target_energy', 'min_energy', 'max_energy',
      'target_popularity', 'min_popularity'
    ];

    tunableParams.forEach(param => {
      if (params[param]) queryParams.append(param, params[param]);
    });

    const url = `https://api.spotify.com/v1/recommendations?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Recommendations request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

async function searchTracksByGenre(accessToken, genre, limit = 50) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=genre:"${encodeURIComponent(genre)}"&type=track&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search tracks by genre: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error searching tracks by genre:', error);
    throw error;
  }
}

export const generateSetPlan = async ({ description, genre, length, referenceArtists }) => {
  try {
    const accessToken = await spotifyApi.getAccessToken();
    
    // Get tracks from reference artists
    const artistTracks = await getRecommendations(accessToken, {
      seed_artists: referenceArtists,
      limit: 50
    });

    // Get tracks from genre
    const genreTracks = await searchTracksByGenre(accessToken, genre);
    
    // Combine and deduplicate tracks
    let allTracks = [...artistTracks, ...genreTracks];
    allTracks = Array.from(new Map(allTracks.map(track => [track.id, track])).values());
    
    // Shuffle tracks
    allTracks = allTracks.sort(() => Math.random() - 0.5);

    // Calculate number of tracks needed
    const numberOfTracks = Math.ceil(length / 4);
    const selectedTracks = allTracks.slice(0, numberOfTracks);

    // Format the response
    const tracks = selectedTracks.map((track, index) => {
      const section = index === 0 ? 'Intro' :
                     index < numberOfTracks * 0.3 ? 'Build' :
                     index < numberOfTracks * 0.7 ? 'Peak' :
                     'Outro';
      
      return {
        name: track.name,
        artist: track.artists[0].name,
        section,
        energy: track.energy || 0.5,
        duration: Math.floor(track.duration_ms / 1000 / 60),
        preview_url: track.preview_url,
        spotify_url: track.external_urls.spotify
      };
    });

    return {
      description,
      genre,
      total_duration: length,
      sections: {
        intro: tracks.filter(t => t.section === 'Intro'),
        build: tracks.filter(t => t.section === 'Build'),
        peak: tracks.filter(t => t.section === 'Peak'),
        outro: tracks.filter(t => t.section === 'Outro')
      }
    };
  } catch (error) {
    console.error('Error in generateSetPlan:', error);
    throw error;
  }
}; 