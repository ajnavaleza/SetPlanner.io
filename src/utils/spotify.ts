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
      const errorText = await response.text();
      console.error('Search failed:', errorText);
      throw new Error('Search failed');
    }
    
    const data = await response.json();
    return data.tracks || [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}; 