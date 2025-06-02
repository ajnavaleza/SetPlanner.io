import dotenv from 'dotenv';

dotenv.config();

// Debug the credentials (without exposing them)
console.log('Spotify Credentials Check:', {
  hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
  clientIdLength: process.env.SPOTIFY_CLIENT_ID?.length,
  hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
  clientSecretLength: process.env.SPOTIFY_CLIENT_SECRET?.length
});

// Function to get access token
async function getAccessToken() {
  try {
    console.log('Requesting access token...');
    
    const authString = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Access token obtained successfully');
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

// Function to get related artists
async function getRelatedArtists(accessToken, artistId) {
  try {
    console.log(`Getting related artists for artist ID: ${artistId}`);
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Related artists request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        artistId
      });
      throw new Error(`Failed to get related artists: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully found ${data.artists.length} related artists`);
    return data.artists;
  } catch (error) {
    console.error('Error getting related artists:', error);
    throw error;
  }
}

// Function to get artist's top tracks
async function getArtistTopTracks(accessToken, artistId) {
  try {
    console.log(`Getting top tracks for artist ID: ${artistId}`);
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Top tracks request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        artistId
      });
      throw new Error(`Failed to get top tracks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully found ${data.tracks.length} top tracks`);
    return data.tracks;
  } catch (error) {
    console.error('Error getting top tracks:', error);
    throw error;
  }
}

// Function to get recommendations from Spotify
async function getRecommendations(accessToken, params) {
  try {
    // Build query string manually to ensure correct format
    const queryParams = new URLSearchParams();
    
    // Add seed_artists (required)
    if (!params.seed_artists) {
      throw new Error('seed_artists parameter is required');
    }
    queryParams.append('seed_artists', params.seed_artists);
    
    // Add limit
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }

    // Add tunable attributes for better genre matching
    if (params.target_danceability) queryParams.append('target_danceability', params.target_danceability);
    if (params.min_danceability) queryParams.append('min_danceability', params.min_danceability);
    if (params.target_energy) queryParams.append('target_energy', params.target_energy);
    if (params.min_energy) queryParams.append('min_energy', params.min_energy);
    if (params.max_energy) queryParams.append('max_energy', params.max_energy);
    if (params.target_popularity) queryParams.append('target_popularity', params.target_popularity);
    if (params.min_popularity) queryParams.append('min_popularity', params.min_popularity);

    const url = `https://api.spotify.com/v1/recommendations?${queryParams.toString()}`;
    console.log('Full recommendations URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Log response details
    console.log('Recommendations response status:', response.status);
    const responseText = await response.text();
    console.log('Recommendations raw response:', responseText);

    if (!response.ok) {
      throw new Error(`Recommendations request failed: ${response.status} ${response.statusText} - ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse recommendations response as JSON:', e);
      throw new Error('Invalid JSON response from Spotify API');
    }
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

// Function to get available genres
async function getAvailableGenres(accessToken) {
  try {
    const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Genre request failed: ${JSON.stringify(data)}`);
    }

    console.log('Available genres:', data.genres);
    return data.genres;
  } catch (error) {
    console.error('Error getting genres:', error);
    throw error;
  }
}

// Default genres to use if we can't get them from Spotify
const DEFAULT_GENRES = ['electronic', 'dance', 'house'];

async function searchTracksByGenre(accessToken, genre, limit = 50) {
  try {
    console.log(`Searching tracks for genre: ${genre}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=genre:"${encodeURIComponent(genre)}"&type=track&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Genre track search failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to search tracks by genre: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Found ${data.tracks.items.length} tracks for genre ${genre}`);
    console.log('Tracks:', data.tracks.items);
    return data.tracks.items;
  } catch (error) {
    console.error('Error searching tracks by genre:', error);
    throw error;
  }
}

export const generateSetPlan = async ({ description, genre, length, referenceArtists }) => {
  try {
    console.log('Starting set plan generation with params:', {
      description,
      genre,
      length,
      referenceArtists
    });

    // Get access token
    const accessToken = await getAccessToken();

    // Search for the reference artist
    console.log('Searching for reference artist:', referenceArtists);
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(referenceArtists)}&type=artist&limit=1`;
    console.log('Search URL:', searchUrl);

    const artistSearchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!artistSearchResponse.ok) {
      const errorText = await artistSearchResponse.text();
      console.error('Artist search failed:', {
        status: artistSearchResponse.status,
        statusText: artistSearchResponse.statusText,
        error: errorText,
        searchTerm: referenceArtists
      });
      throw new Error(`Artist search failed: ${artistSearchResponse.status} ${artistSearchResponse.statusText}`);
    }

    const artistSearchData = await artistSearchResponse.json();
    
    if (!artistSearchData.artists?.items?.length) {
      console.error('No artists found:', { searchData: artistSearchData });
      throw new Error(`Artist "${referenceArtists}" not found`);
    }

    const mainArtist = artistSearchData.artists.items[0];
    console.log('Found main artist:', {
      name: mainArtist.name,
      id: mainArtist.id,
      genres: mainArtist.genres
    });

    // Get artist's top tracks
    const artistTracks = await getArtistTopTracks(accessToken, mainArtist.id);
    console.log(`Got ${artistTracks.length} tracks from main artist`);

    // Get additional tracks by genre
    const targetGenre = genre || mainArtist.genres[0] || 'electronic';
    const genreTracks = await searchTracksByGenre(accessToken, targetGenre);
    
    // Combine and shuffle all tracks
    let allTracks = [...artistTracks, ...genreTracks];
    console.log(`Total tracks found: ${allTracks.length}`);


    if (allTracks.length === 0) {
      throw new Error('No tracks found for the selected artist and genre');
    }

    // Remove duplicates by track ID
    allTracks = Array.from(new Map(allTracks.map(track => [track.id, track])).values());
    
    // Shuffle tracks
    allTracks = allTracks.sort(() => Math.random() - 0.5);

    // Calculate number of tracks needed
    const numberOfTracks = Math.ceil(length / 4);
    const selectedTracks = allTracks; //.slice(0, numberOfTracks);

    console.log(`Selected ${selectedTracks.length} tracks for the set`);

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

    const result = {
      description,
      genre: targetGenre,
      total_duration: length,
      sections: {
        intro: tracks.filter(t => t.section === 'Intro'),
        build: tracks.filter(t => t.section === 'Build'),
        peak: tracks.filter(t => t.section === 'Peak'),
        outro: tracks.filter(t => t.section === 'Outro')
      }
    };

    console.log('Successfully generated set plan');
    return result;
  } catch (error) {
    console.error('Error in generateSetPlan:', error);
    throw error;
  }
}; 