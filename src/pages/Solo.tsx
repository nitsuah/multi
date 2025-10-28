import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Stats, OrbitControls } from "@react-three/drei";
import { io, Socket } from "socket.io-client";
import * as THREE from "three";
import type { Clients } from "../types/socket";
import PerformanceMonitor from "../components/PerformanceMonitor";
import QualitySettings, { QualityLevel } from "../components/QualitySettings";
import { KeyDisplay, W, A, S, D, SHIFT } from "../components/utils";
import "../styles/App.css";

const RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000; // Start with 1 second

interface UserWrapperProps {
  position: [number, number, number];
  rotation: [number, number, number];
  id: string;
}

const UserWrapper: React.FC<UserWrapperProps> = ({
  position,
  rotation,
  id,
}) => {
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

interface PlayerCharacterProps {
  keysPressed: { [key: string]: boolean };
  socketClient: Socket | null;
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  keysPressed,
  socketClient,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const cameraOffset = useRef(new THREE.Vector3(0, 3, -5)); // Camera position relative to player

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Calculate direction based on keys pressed
    direction.current.set(0, 0, 0);

    if (keysPressed[W]) direction.current.z += 1;
    if (keysPressed[S]) direction.current.z -= 1;
    if (keysPressed[A]) direction.current.x += 1;
    if (keysPressed[D]) direction.current.x -= 1;

    // Normalize direction
    if (direction.current.length() > 0) {
      direction.current.normalize();

      // Apply speed (faster with shift)
      const speed = keysPressed[SHIFT] ? 5 : 2;
      velocity.current.copy(direction.current).multiplyScalar(speed * delta);

      // Move the character
      meshRef.current.position.add(velocity.current);

      // Rotate character to face movement direction
      if (direction.current.length() > 0) {
        const angle = Math.atan2(direction.current.x, direction.current.z);
        meshRef.current.rotation.y = angle;
      }

      // Emit position to server
      if (socketClient) {
        socketClient.emit("move", {
          position: meshRef.current.position.toArray(),
          rotation: meshRef.current.rotation.toArray(),
        });
      }
    }

    // Smooth third-person camera follow
    const idealCameraPosition = new THREE.Vector3(
      meshRef.current.position.x + cameraOffset.current.x,
      meshRef.current.position.y + cameraOffset.current.y,
      meshRef.current.position.z + cameraOffset.current.z
    );

    // Lerp camera position for smooth following
    state.camera.position.lerp(idealCameraPosition, 0.1);

    // Make camera look at the character
    state.camera.lookAt(
      meshRef.current.position.x,
      meshRef.current.position.y + 0.5,
      meshRef.current.position.z
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color="#4a90e2" />
    </mesh>
  );
};

const Solo: React.FC = () => {
  const [socketClient, setSocketClient] = useState<Socket | null>(null);
  const [clients, setClients] = useState<Clients>({});
  const [isConnected, setIsConnected] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [quality, setQuality] = useState<QualityLevel>("auto");
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {}
  );
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const keyDisplayRef = useRef<KeyDisplay | null>(null);
  const lastEmitTime = useRef(0);

  // Quality presets
  const getQualitySettings = (level: QualityLevel) => {
    switch (level) {
      case "low":
        return {
          shadows: false,
          pixelRatio: 1,
          antialias: false,
        };
      case "medium":
        return {
          shadows: true,
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          antialias: true,
        };
      case "high":
        return {
          shadows: true,
          pixelRatio: window.devicePixelRatio,
          antialias: true,
        };
      default: // auto
        return {
          shadows: currentFPS >= 50,
          pixelRatio: currentFPS >= 50 ? window.devicePixelRatio : 1,
          antialias: currentFPS >= 40,
        };
    }
  };

  const qualitySettings = getQualitySettings(quality);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current < RECONNECT_ATTEMPTS) {
      const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current);
      console.log(
        `Reconnecting in ${delay}ms (attempt ${
          reconnectAttempts.current + 1
        }/${RECONNECT_ATTEMPTS})`
      );

      reconnectTimeout.current = setTimeout(() => {
        reconnectAttempts.current += 1;
        if (socketClient) {
          socketClient.connect();
        }
      }, delay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }, [socketClient]);

  const connectSocket = useCallback(() => {
    const serverUrl =
      import.meta.env.VITE_SOCKET_SERVER_URL || window.location.origin;
    const socket = io(serverUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);

      // Attempt manual reconnection with exponential backoff
      if (reason === "io server disconnect" || reason === "transport close") {
        attemptReconnect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
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

  // Keyboard controls
  useEffect(() => {
    console.log("Setting up keyboard controls");
    keyDisplayRef.current = new KeyDisplay();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyDown = (e: any) => {
      const key = e.key.toLowerCase();
      console.log("Key down:", key);
      if ([W, A, S, D, SHIFT].includes(key)) {
        e.preventDefault(); // Prevent default browser behavior
        setKeysPressed((prev) => ({ ...prev, [key]: true }));
        keyDisplayRef.current?.down(key);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyUp = (e: any) => {
      const key = e.key.toLowerCase();
      console.log("Key up:", key);
      if ([W, A, S, D, SHIFT].includes(key)) {
        e.preventDefault();
        setKeysPressed((prev) => ({ ...prev, [key]: false }));
        keyDisplayRef.current?.up(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      console.log("Cleaning up keyboard controls");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // Clean up KeyDisplay elements
      if (keyDisplayRef.current) {
        [W, A, S, D, SHIFT].forEach((key) => {
          const element = keyDisplayRef.current?.map.get(key);
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!socketClient) return;
    socketClient.on("move", (clients: Clients) => {
      setClients(clients);
    });
    return () => {
      socketClient.off("move");
    };
  }, [socketClient]);

  // Emit position updates (throttled to 50ms)
  useEffect(() => {
    if (!socketClient || !isConnected) return;

    const hasAnyKeyPressed = Object.values(keysPressed).some(
      (pressed) => pressed
    );
    if (!hasAnyKeyPressed) return;

    const now = Date.now();
    if (now - lastEmitTime.current < 50) return;
    lastEmitTime.current = now;

    console.log("Emitting movement:", keysPressed);
    // Emit basic movement state for now (will integrate with CharacterControls later)
    socketClient.emit("move", { keysPressed });
  }, [keysPressed, socketClient, isConnected]);

  return (
    <>
      <PerformanceMonitor onPerformanceChange={setCurrentFPS} />
      <QualitySettings onChange={setQuality} currentFPS={currentFPS} />
      {!isConnected && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            color: "white",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          Disconnected - Reconnecting...
        </div>
      )}
      <Canvas
        camera={{ position: [0, 3, -5], near: 0.1, far: 1000 }}
        shadows={qualitySettings.shadows}
        dpr={qualitySettings.pixelRatio}
        gl={{ antialias: qualitySettings.antialias }}
      >
        <Stats />
        <OrbitControls enabled={false} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[-60, 100, -10]}
          intensity={1}
          castShadow={qualitySettings.shadows}
          shadow-mapSize-width={qualitySettings.shadows ? 4096 : 512}
          shadow-mapSize-height={qualitySettings.shadows ? 4096 : 512}
        />
        <gridHelper rotation={[0, 0, 0]} />
        <PlayerCharacter
          keysPressed={keysPressed}
          socketClient={socketClient}
        />
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
