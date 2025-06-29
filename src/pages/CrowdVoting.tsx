import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { searchTracks, SpotifyTrack } from '../utils/spotify';
import debounce from 'lodash/debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music2, ThumbsUp } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  addedBy: string;
}

const CrowdVoting: React.FC = () => {
  const socket = useSocket();
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside of search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Request initial system status
    socket.emit('getSystemStatus');

    socket.on('connect', () => {
      // Re-request system status on reconnection
      socket.emit('getSystemStatus');
      setError('');
    });

    socket.on('disconnect', () => {
      setError('Lost connection to server. Reconnecting...');
    });

    socket.on('systemStatus', (status: boolean) => {
      setIsSystemActive(status);
      setError(''); // Clear any connection errors when we get status
    });

    socket.on('songList', (updatedSongs: Song[]) => {
      setSongs(updatedSongs);
    });

    socket.on('error', (message: string) => {
      setError(message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('systemStatus');
      socket.off('songList');
      socket.off('error');
    };
  }, [socket]);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query.trim()) {
        setIsLoading(true);
        const results = await searchTracks(query);
        setSearchResults(results);
        setShowDropdown(true);
        setIsLoading(false);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleTrackSelect = (track: SpotifyTrack) => {
    if (!socket) return;
    
    socket?.emit('suggestSong', {
      title: track.name,
      artist: track.artists.join(', ')
    });

    setSearchQuery('');
    setShowDropdown(false);
    setError('');
  };

  const handleVote = (songId: string) => {
    if (!isSystemActive) {
      setError('Voting system is currently inactive');
      return;
    }
    socket?.emit('voteSong', songId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container"
    >
      <div className="content-wrapper">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="page-title"
        >
          Live Song Requests
        </motion.h1>
        
        <AnimatePresence>
          {!isSystemActive && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-banner"
            >
              <p className="error-text">The voting system is currently inactive. Please wait for the DJ to activate it.</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-banner"
            >
              <p className="error-text">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="search-section"
          ref={searchContainerRef}
        >
          <div className="section-header">
            <Music2 className="w-6 h-6 text-blue-500" />
            <h2 className="section-title">Suggest a Song</h2>
          </div>
          <div className="search-input-wrapper">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                placeholder="Search for a song..."
                disabled={!isSystemActive}
              />
            </div>
            
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="loading-spinner"></div>
              </div>
            )}

            <AnimatePresence>
              {showDropdown && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="search-results-dropdown"
                >
                  {searchResults.map((track) => (
                    <motion.div
                      key={track.id}
                      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      className="search-result-item"
                      onClick={() => handleTrackSelect(track)}
                    >
                      {track.albumArt && (
                        <img src={track.albumArt} alt={track.album} className="result-album-art" />
                      )}
                      <div>
                        <div className="font-medium">{track.name}</div>
                        <div className="result-details">
                          {track.artists.join(', ')} • {track.album}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="songs-section"
        >
          <div className="section-header">
            <ThumbsUp className="w-6 h-6 text-green-500" />
            <h2 className="section-title">Current Requests</h2>
          </div>
          {songs.length === 0 ? (
            <p className="empty-songs">No songs have been suggested yet.</p>
          ) : (
            <div className="space-y-4">
              {songs.sort((a, b) => b.votes - a.votes).map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="song-item"
                >
                  <div>
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.span 
                      key={song.votes}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="song-votes"
                    >
                      {song.votes} votes
                    </motion.span>
                    <button
                      onClick={() => handleVote(song.id)}
                      className="vote-button"
                      disabled={!isSystemActive}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Vote
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CrowdVoting; 