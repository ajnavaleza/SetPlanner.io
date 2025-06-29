import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  addedBy: string;
}

const DJControlPanel: React.FC = () => {
  const socket = useSocket();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isVotingEnabled, setIsVotingEnabled] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (!socket) return;

    const token = localStorage.getItem('dj_token');
    if (!token) {
      navigate('/dj-login');
      return;
    }

    // Authenticate with socket
    socket.emit('authenticate', token);

    // Listen for auth status
    socket.on('authStatus', (isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        logout();
        navigate('/dj-login');
      }
    });

    // Listen for song list updates
    socket.on('songList', (updatedSongs: Song[]) => {
      setSongs(updatedSongs);
    });

    // Get initial system status
    socket.emit('getSystemStatus');
    socket.on('systemStatus', (status: boolean) => {
      setIsVotingEnabled(status);
    });

    // Set QR code URL
    const baseUrl = window.location.origin;
    setQrUrl(`${baseUrl}/crowd-voting`);

    return () => {
      socket.off('songList');
      socket.off('systemStatus');
      socket.off('authStatus');
    };
  }, [socket, navigate, logout]);

  const toggleVotingSystem = () => {
    if (!socket) return;

    const token = localStorage.getItem('dj_token');
    if (!token) {
      navigate('/dj-login');
      return;
    }
    const newStatus = !isVotingEnabled;
    socket.emit('setSystemStatus', newStatus, token);
    setIsVotingEnabled(newStatus);
  };

  const removeSong = (songId: string) => {
    if (!socket) return;

    const token = localStorage.getItem('dj_token');
    if (!token) {
      navigate('/dj-login');
      return;
    }
    socket.emit('removeSong', songId, token);
  };

  const handleLogout = () => {
    logout();
    navigate('/dj-login');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">DJ Control Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Crowd Voting Control</h2>
              <p className="text-gray-400">Manage song requests and voting system</p>
            </div>
            <button
              onClick={toggleVotingSystem}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isVotingEnabled
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-[#00875F] hover:bg-[#015F43] text-white'
              }`}
            >
              {isVotingEnabled ? 'Disable Voting' : 'Enable Voting'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Song Requests</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {songs.length === 0 ? (
                  <p className="text-gray-400">No song requests yet</p>
                ) : (
                  songs
                    .sort((a, b) => b.votes - a.votes)
                    .map((song) => (
                      <div
                        key={song.id}
                        className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-medium text-white">{song.title}</h4>
                          <p className="text-sm text-gray-400">{song.artist}</p>
                          <p className="text-xs text-gray-500">Requested by: {song.addedBy}</p>
                          <p className="text-sm text-[#00B37E] font-medium">{song.votes} votes</p>
                        </div>
                        <button
                          onClick={() => removeSong(song.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">QR Code</h3>
              <div className="bg-white p-4 rounded-lg inline-block">
                <QRCodeSVG value={qrUrl} size={200} />
              </div>
              <p className="mt-4 text-gray-400">
                Share this QR code with your audience to let them join the voting system
              </p>
              <p className="text-sm text-gray-500 break-all mt-2">{qrUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJControlPanel; 