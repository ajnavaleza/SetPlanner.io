// Song related types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  albumArt: string;
  preview_url?: string;
  popularity?: number;
  duration?: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  addedBy: string;
  duration?: number;
  preview_url?: string;
  popularity?: number;
}

// Set Plan related types
export interface SetPlan {
  genre: string;
  description?: string;
  total_duration: number;
  tracks: SpotifyTrack[];
  enhanced: boolean;
}

// Authentication related types
export interface AuthResponse {
  token: string;
  error?: string;
}

// Socket event types
export interface SocketEvents {
  systemStatus: boolean;
  songList: Song[];
  error: string;
  suggestSong: { title: string; artist: string };
  voteSong: string;
}

// Component prop types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface SocketProviderProps {
  children: React.ReactNode;
} 