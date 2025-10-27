import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Text, Stats } from '@react-three/drei'
import { MeshNormalMaterial, BoxGeometry, Scene, PerspectiveCamera, WebGLRenderer, Texture } from 'three';
import { io } from 'socket.io-client'
import {KeyDisplay} from "../components/utils"
import '../styles/App.css'
import { CharacterControls } from '../components/characterControls';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import type { MutableRefObject } from 'react';
import type { Socket } from 'socket.io-client';

interface ControlsWrapperProps {
    socket: Socket;
}

const ControlsWrapper = ({ socket }: ControlsWrapperProps) => {
    const controlsRef = useRef<any>(null);

    useEffect(() => {
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

function Solo() {
    const [socketClient, setSocketClient] = useState(null)
    const [clients, setClients] = useState({})
    // References for scene, camera, and renderer
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);


    useEffect(() => {
        // SCENE
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa8def0);
        sceneRef.current = scene;

        // CAMERA
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

        // RENDERER
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;

        // CONTROLS
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.minDistance = 5;
        orbitControls.maxDistance = 15;
        orbitControls.enablePan = false;
        orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;

        orbitControls.update();

        // LIGHTS
        light();

        // FLOOR
        generateFloor();

        // MODEL WITH ANIMATIONS
        let characterControls: CharacterControls;
        new GLTFLoader().load('models/Soldier.glb', function (gltf) {
            const model = gltf.scene;
            model.traverse(function (object: any) {
                if (object.isMesh) object.castShadow = true;
            });
            sceneRef.current.add(model);

            const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap: Map<string, THREE.AnimationAction> = new Map();
            gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
                animationsMap.set(a.name, mixer.clipAction(a));
            });

            characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle');
        });

        // CONTROL KEYS
        const keysPressed = {};
        const keyDisplayQueue = new KeyDisplay();
        document.addEventListener('keydown', (event) => {
            keyDisplayQueue.down(event.key);
            if (event.shiftKey && characterControls) {
                characterControls.switchRunToggle();
            } else {
                (keysPressed as any)[event.key.toLowerCase()] = true;
            }
        }, false);
        document.addEventListener('keyup', (event) => {
            keyDisplayQueue.up(event.key);
            (keysPressed as any)[event.key.toLowerCase()] = false;
        }, false);

        const clock = new THREE.Clock();
        // ANIMATE
        function animate() {
            import type { Socket as SocketType } from 'socket.io-client';
            interface Clients {
                [key: string]: { position: [number, number, number]; rotation: [number, number, number] };
            }
            const Solo: React.FC = () => {
                const [socketClient, setSocketClient] = useState<SocketType | null>(null);
                const [clients, setClients] = useState<Clients>({});
                // References for scene, camera, and renderer
                const sceneRef = useRef<Scene | null>(null);
                const cameraRef = useRef<PerspectiveCamera | null>(null);
                const rendererRef = useRef<WebGLRenderer | null>(null);

                useEffect(() => {
                    // SCENE
                    const scene = new Scene();
                    scene.background = new THREE.Color(0xa8def0);
                    sceneRef.current = scene;

                    // CAMERA
                    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                    cameraRef.current = camera;

                    // RENDERER
                    const renderer = new WebGLRenderer({ antialias: true });
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    renderer.setPixelRatio(window.devicePixelRatio);
                    rendererRef.current = renderer;

                    // CONTROLS
                    const orbitControls = new OrbitControls(camera, renderer.domElement);
                    orbitControls.enableDamping = true;
                    orbitControls.minDistance = 5;
                    orbitControls.maxDistance = 15;
                    orbitControls.enablePan = false;
                    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;

                    orbitControls.update();

                    // LIGHTS
                    function light() {
                        if (!sceneRef.current) return;
                        sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.7));
                        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
                        dirLight.position.set(-60, 100, -10);
                        dirLight.castShadow = true;
                        dirLight.shadow.camera.top = 50;
                        dirLight.shadow.camera.bottom = -50;
                        dirLight.shadow.camera.left = -50;
                        dirLight.shadow.camera.right = 50;
                        dirLight.shadow.camera.near = 0.1;
                        dirLight.shadow.camera.far = 200;
                        dirLight.shadow.mapSize.width = 4096;
                        dirLight.shadow.mapSize.height = 4096;
                        sceneRef.current.add(dirLight);
                    }

                    // FLOOR
                    function generateFloor() {
                        if (!sceneRef.current) return;
                        const textureLoader = new THREE.TextureLoader();
                        const placeholder = textureLoader.load('./textures/placeholder/placeholder.png');
                        const sandBaseColor = textureLoader.load('./textures/sand/Sand 002_COLOR.jpg');
                        const sandNormalMap = textureLoader.load('./textures/sand/Sand 002_NRM.jpg');
                        const sandHeightMap = textureLoader.load('./textures/sand/Sand 002_DISP.jpg');
                        const sandAmbientOcclusion = textureLoader.load('./textures/sand/Sand 002_OCC.jpg');

                        const WIDTH = 80;
                        const LENGTH = 80;

                        const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
                        const material = new THREE.MeshStandardMaterial({
                            map: sandBaseColor ?? undefined,
                            normalMap: sandNormalMap ?? undefined,
                            displacementMap: sandHeightMap ?? undefined,
                            displacementScale: 0.1,
                            aoMap: sandAmbientOcclusion ?? undefined,
                        });
                        function wrapAndRepeatTexture(map: Texture | null | undefined) {
                            if (!map) return;
                            map.wrapS = map.wrapT = THREE.RepeatWrapping;
                            map.repeat.x = map.repeat.y = 10;
                        }
                        wrapAndRepeatTexture(material.map);
                        wrapAndRepeatTexture(material.normalMap);
                        wrapAndRepeatTexture(material.displacementMap);
                        wrapAndRepeatTexture(material.aoMap);
                        const floor = new THREE.Mesh(geometry, material);
                        floor.receiveShadow = true;
                        floor.rotation.x = -Math.PI / 2;
                        sceneRef.current.add(floor);
                    }

                    light();
                    generateFloor();

                    // MODEL WITH ANIMATIONS
                    let characterControls: any;
                    new GLTFLoader().load('models/Soldier.glb', function (gltf) {
                        const model = gltf.scene;
                        model.traverse(function (object: any) {
                            if (object.isMesh) object.castShadow = true;
                        });
                        if (sceneRef.current) sceneRef.current.add(model);
                        const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
                        const mixer = new THREE.AnimationMixer(model);
                        const animationsMap: Map<string, THREE.AnimationAction> = new Map();
                        gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
                            animationsMap.set(a.name, mixer.clipAction(a));
                        });
                        characterControls = new (window as any).CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle');
                    });

                    // CONTROL KEYS
                    const keysPressed: Record<string, boolean> = {};
                    const keyDisplayQueue = new (window as any).KeyDisplay();
                    document.addEventListener('keydown', (event) => {
                        keyDisplayQueue.down(event.key);
                        if (event.shiftKey && characterControls) {
                            characterControls.switchRunToggle();
                        } else {
                            keysPressed[event.key.toLowerCase()] = true;
                        }
                    }, false);
                    document.addEventListener('keyup', (event) => {
                        keyDisplayQueue.up(event.key);
                        keysPressed[event.key.toLowerCase()] = false;
                    }, false);

                    const clock = new THREE.Clock();
                    // ANIMATE
                    function animate() {
                        let mixerUpdateDelta = clock.getDelta();
                        if (characterControls) {
                            characterControls.update(mixerUpdateDelta, keysPressed);
                        }
                        orbitControls.update();
                        renderer.render(scene, camera);
                        requestAnimationFrame(animate);
                    }
                    document.body.appendChild(renderer.domElement);
                    animate();

                    // RESIZE HANDLER
                    function onWindowResize() {
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(window.innerWidth, window.innerHeight);
                        keyDisplayQueue.updatePosition();
                    }
                    window.addEventListener('resize', onWindowResize);

                    // Cleanup function
                    return () => {
                        renderer.dispose();
                        window.removeEventListener('resize', onWindowResize);
                        document.body.removeChild(renderer.domElement);
                    };
                }, []);

                useEffect(() => {
                    // On mount initialize the socket connection
                    const socket = io();
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
                        )
                    );
                };
                <gridHelper rotation={[0, 0, 0]} />
                {/* Filter myself from the client list and create user boxes with IDs */}
                {Object.keys(clients)
                    .filter((clientKey) => clientKey !== socketClient.id)
                    .map((client) => {
                        const { position, rotation } = clients[client]
                        return (
                            <UserWrapper
                                id={client}
                                position={position}
                                rotation={rotation}
                            />
                        )
                    })}
            </Canvas>
        )
    )
}

export default Solo
