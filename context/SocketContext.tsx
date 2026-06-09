import Constants from 'expo-constants';
import React, { createContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SOCKET_URL = Constants.expoConfig?.extra?.SOCKET_URL || 'http://localhost:3000';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { userToken } = useAuth();

  useEffect(() => {
    if (!userToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token: userToken },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;