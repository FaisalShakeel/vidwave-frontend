// SocketContext.js
import { jwtDecode } from 'jwt-decode'; 
import React, { createContext, useContext, useEffect, useState } from 'react'; 
import io from 'socket.io-client';  

const SocketContext = createContext(null);   

export const useSocket = () => {
  return useContext(SocketContext); 
};

const generateRandomUserId = () => {
  return Math.random().toString(36).substring(2, 15); 
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    let decodedUser;
    let userId;

    // Determine user ID based on authentication tokens
    if (token) {
      decodedUser = jwtDecode(token);
      userId = decodedUser.id;
    } else {
      userId = generateRandomUserId();
    }

    const createSocket = () => {
      const socketInstance = io('http://localhost:5000', {
        query: { userId },
        reconnection: true,
        reconnectionAttempts: Infinity,
        pingTimeout: 120000,
        pingInterval: 30000,
      });

      // Handle socket connection
      socketInstance.on('connect', () => {
        console.log("Socket Instance", socketInstance);
        console.log('Connected with ID:', socketInstance.id);
        setSocket(socketInstance);
        setLoading(false);
      });

      // Handle disconnection
      socketInstance.on('disconnect', (reason) => {
        setLoading(true);
        console.log('Disconnected:', reason);
        if (reason === 'ping timeout') {
          console.warn('Disconnected due to ping timeout.');
        }
        // Attempt to reconnect
        reconnectSocket(socketInstance, userId);
      });

      // Handle successful reconnections
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log(`Reconnected after ${attemptNumber} attempts.`);
        setLoading(false);
      });

      return socketInstance;
    };

    const socketInstance = createSocket();

    // Cleanup function to disconnect the socket
    return () => {
      socketInstance.off('disconnect');
      socketInstance.off('reconnect');
      socketInstance.disconnect();
    };
  }, []);

  const reconnectSocket = (socketInstance, userId) => {
    const attemptReconnect = () => {
      console.log('Attempting to reconnect... For UserID', userId);

      // Delay before trying to reconnect
      setTimeout(() => {
        if (socketInstance.disconnected) {
          // Create a new socket connection
          const newSocket = io('http://localhost:5000', {
            query: { userId },
            reconnection: true,
            reconnectionAttempts: Infinity,
          });

          newSocket.on('connect', () => {
            console.log('Reconnected with ID:', newSocket.id);
            setLoading(false)
            setSocket(newSocket);
          });

          newSocket.on('disconnect', (reason) => {
            console.log("Socket Has Been Disconnected Again Due To", reason);
            attemptReconnect(); // Try reconnecting again
          });

          // Clear previous socket instance if necessary
          socketInstance.disconnect();
        }
      }, 1000); // Retry every 1 second if still disconnected
    };

    attemptReconnect();
  };

  return (
    <SocketContext.Provider value={{ socket, loading }}>
      {children}
    </SocketContext.Provider>
  );
};