import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
});

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  albumArt: string;
}

export const searchTracks = async (query: string): Promise<SpotifyTrack[]> => {
  try {
    const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error('Search failed:', await response.text());
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return data.tracks || [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}; 