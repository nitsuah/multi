import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Stats } from '@react-three/drei'
import { MeshNormalMaterial, BoxGeometry } from 'three';
import { io } from 'socket.io-client'
import Footer from "../components/Footer"
import '../styles/App.css'

import type { Socket } from 'socket.io-client';

interface ControlsWrapperProps {
    socket: Socket;
}

const ControlsWrapper = ({ socket }: ControlsWrapperProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onControlsChange = (val: any) => {
            const { position, rotation } = val.target.object;
            const { id } = socket;
            const posArray: number[] = [];
            const rotArray: number[] = [];
            position.toArray(posArray);
            rotation.toArray(rotArray);
            socket.emit('move', {
                id,
                rotation: rotArray,
                position: posArray,
            });
        };
        const current = controlsRef.current as any;
        if (current && typeof current.addEventListener === 'function') {
            current.addEventListener('change', onControlsChange);
        }
        return () => {
            if (current && typeof current.removeEventListener === 'function') {
                current.removeEventListener('change', onControlsChange);
            }
        };
    }, [socket]);
    return <OrbitControls ref={controlsRef} />;
};

interface UserWrapperProps {
    position: [number, number, number];
    rotation: [number, number, number];
    id: string;
}
const UserWrapper: React.FC<UserWrapperProps> = ({ position, rotation, id }) => {
    return (
        <mesh
            position={position}
            rotation={rotation}
            geometry={new BoxGeometry()}
            material={new MeshNormalMaterial()}
        >
            {/* Optionally show the ID above the user's mesh */}
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

import type { Socket as SocketType } from 'socket.io-client';
interface Clients {
    [key: string]: { position: [number, number, number]; rotation: [number, number, number] };
}
const Lobby: React.FC = () => {
    const [socketClient, setSocketClient] = useState<SocketType | null>(null);
    const [clients, setClients] = useState<Clients>({});

    useEffect(() => {
        // On mount initialize the socket connection
    const serverUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SOCKET_SERVER_URL) || undefined;
    const socket = io(serverUrl || window.location.origin, { transports: ['websocket'] });
        setSocketClient(socket);
        // Dispose gracefully
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socketClient) {
            socketClient.on('move', (clients: Clients) => {
                setClients(clients);
            });
        }
    }, [socketClient]);

        if (!socketClient) return null;

        return (
            React.createElement(React.Fragment, null,
                React.createElement("div", { className: "App" },
                    React.createElement(Canvas, { camera: { position: [0, 1, -5], near: 0.1, far: 1000 } },
                        React.createElement(Stats, null),
                        React.createElement(ControlsWrapper, { socket: socketClient }),
                        React.createElement("gridHelper", { rotation: [0, 0, 0] }),
                        Object.keys(clients)
                            .filter((clientKey) => clientKey !== socketClient.id)
                            .map((client) => {
                                const { position, rotation } = clients[client];
                                return React.createElement(UserWrapper, {
                                    key: client,
                                    id: client,
                                    position: position,
                                    rotation: rotation
                                });
                            })
                    ),
                    React.createElement(Footer, null)
                )
            )
        );
    };

export default Lobby
