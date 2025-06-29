import { createContext, useContext, useEffect, useState, FC, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
  on: <T = any>(event: string, callback: (data: T) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  connected: boolean;
}

// In production, use the deployed server URL, otherwise use localhost
const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_SOCKET_URL || 'https://your-deployed-server.vercel.app'
  : 'http://localhost:3001';

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const contextValue: SocketContextType = {
    on: <T = any>(event: string, callback: (data: T) => void) => {
      socket?.on(event, callback);
    },
    off: (event: string, callback?: (...args: any[]) => void) => {
      if (callback) {
        socket?.off(event, callback);
      } else {
        socket?.off(event);
      }
    },
    emit: (event: string, ...args: any[]) => {
      if (socket?.connected) {
        socket.emit(event, ...args);
      } else {
        console.warn('Socket is not connected. Cannot emit event:', event);
      }
    },
    connected,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext; 