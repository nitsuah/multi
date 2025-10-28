import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Stats, OrbitControls } from '@react-three/drei';
import { io, Socket } from 'socket.io-client';
import '../styles/App.css';

const RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000; // Start with 1 second

interface UserWrapperProps {
    position: [number, number, number];
    rotation: [number, number, number];
    id: string;
}

const UserWrapper: React.FC<UserWrapperProps> = ({ position, rotation, id }) => {
    return (
        <mesh position={position} rotation={rotation}>
            <boxGeometry />
            <meshNormalMaterial />
            <Text
                position={[0, 1.0, 0]}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {id}
            </Text>
        </mesh>
    );
};

type Clients = Record<string, { position: [number, number, number]; rotation: [number, number, number] }>;

const Solo: React.FC = () => {
    const [socketClient, setSocketClient] = useState<Socket | null>(null);
    const [clients, setClients] = useState<Clients>({});
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    const attemptReconnect = useCallback(() => {
        if (reconnectAttempts.current < RECONNECT_ATTEMPTS) {
            const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current);
            console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${RECONNECT_ATTEMPTS})`);
            
            reconnectTimeout.current = setTimeout(() => {
                reconnectAttempts.current += 1;
                if (socketClient) {
                    socketClient.connect();
                }
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }, [socketClient]);

    const connectSocket = useCallback(() => {
        const serverUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SOCKET_SERVER_URL) || undefined;
        const socket = io(serverUrl || window.location.origin, { 
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: RECONNECT_ATTEMPTS,
            reconnectionDelay: RECONNECT_DELAY,
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setIsConnected(true);
            reconnectAttempts.current = 0;
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
            
            // Attempt manual reconnection with exponential backoff
            if (reason === 'io server disconnect' || reason === 'transport close') {
                attemptReconnect();
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            attemptReconnect();
        });

        setSocketClient(socket);
        return socket;
    }, [attemptReconnect]);

    useEffect(() => {
        const socket = connectSocket();
        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            socket.disconnect();
        };
    }, [connectSocket]);

    useEffect(() => {
        if (!socketClient) return;
        socketClient.on('move', (clients: Clients) => {
            setClients(clients);
        });
        return () => {
            socketClient.off('move');
        };
    }, [socketClient]);

    return (
        <>
            {!isConnected && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    borderRadius: '4px',
                    zIndex: 1000,
                }}>
                    Disconnected - Reconnecting...
                </div>
            )}
            <Canvas camera={{ position: [0, 1, -5], near: 0.1, far: 1000 }} shadows>
                <Stats />
                <OrbitControls enableDamping minDistance={5} maxDistance={15} enablePan={false} maxPolarAngle={Math.PI / 2 - 0.05} />
                <ambientLight intensity={0.7} />
                <directionalLight
                    position={[-60, 100, -10]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={4096}
                    shadow-mapSize-height={4096}
                />
                <gridHelper rotation={[0, 0, 0]} />
                {Object.keys(clients)
                    .filter((clientKey) => socketClient && clientKey !== socketClient.id)
                    .map((client) => {
                        const { position, rotation } = clients[client];
                        return (
                            <UserWrapper
                                key={client}
                                id={client}
                                position={position}
                                rotation={rotation}
                            />
                        );
                    })}
            </Canvas>
        </>
    );
};

export default Solo;
