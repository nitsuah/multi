import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
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

    useEffect(() => {
    const serverUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SOCKET_SERVER_URL) || undefined;
    const socket = io(serverUrl || window.location.origin, { transports: ['websocket'] });
        setSocketClient(socket);
        return () => {
            socket.disconnect();
        };
    }, []);

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
            {/* Render all other clients */}
            {Object.keys(clients)
                .filter((clientKey) => socketClient && clientKey !== socketClient.id)
                .map((client) => {
                    const { position, rotation } = clients[client];
                    // @ts-expect-error: key is a React prop, not a UserWrapperProps prop
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
    );
};

export default Solo;
