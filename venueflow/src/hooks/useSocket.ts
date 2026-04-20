"use client"
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    const socketInstance = io();

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketInstance.on('zonesUpdated', (data: any[]) => {
      setZones(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, zones };
}
