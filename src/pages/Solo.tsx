import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { io, Socket } from "socket.io-client";
import * as THREE from "three";
import type { Clients } from "../types/socket";
import PerformanceMonitor from "../components/PerformanceMonitor";
import QualitySettings, { QualityLevel } from "../components/QualitySettings";
import ThemeToggle from "../components/ThemeToggle";
import Tutorial from "../components/Tutorial";
import HelpModal from "../components/HelpModal";
import ChatBox from "../components/ChatBox";
import CollisionSystem from "../components/CollisionSystem";
import GameManager, { GameState, Player } from "../components/GameManager";
import GameUI from "../components/GameUI";
import { KeyDisplay, W, A, S, D, SHIFT } from "../components/utils";
import "../styles/App.css";

const RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000; // Start with 1 second
const MAX_CHAT_MESSAGES = 50;

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

interface UserWrapperProps {
  position: [number, number, number];
  rotation: [number, number, number];
  id: string;
  isIt?: boolean;
}

// Top-level gated debug logger - only logs in dev
let __isDev = false;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - import.meta may not be available
try {
  // access import.meta in a try to avoid environments where it might not be available
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - import.meta may not be available
  if (import.meta && import.meta.env && import.meta.env.DEV) {
    __isDev = true;
  }
} catch {
  // ignore
}

// Also enable debug if Node's NODE_ENV is not production (useful in test envs)
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - process may not be defined in browser
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV &&
    process.env.NODE_ENV !== "production"
  ) {
    __isDev = true;
  }
} catch {
  // ignore
}

const debug = (...args: unknown[]) => {
  if (__isDev) {
    console.log(...args);
  }
};

const UserWrapper: React.FC<UserWrapperProps> = ({
  position,
  rotation,
  id,
  isIt = false,
}) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color={isIt ? "#ff4444" : "#44ff44"} />
      </mesh>

      {/* Glow effect for 'it' player */}
      {isIt && (
        <mesh>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial color="#ff6666" transparent opacity={0.3} />
        </mesh>
      )}

      <Text
        position={[0, 1.2, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.3}
      >
        {id.slice(-4)}
        {isIt && " (IT)"}
      </Text>
    </group>
  );
};

interface PlayerCharacterProps {
  keysPressed: { [key: string]: boolean };
  socketClient: Socket | null;
  mouseControls: {
    leftClick: boolean;
    rightClick: boolean;
    mouseX: number;
    mouseY: number;
  };
  clients: Clients;
  gameManager: GameManager | null;
  currentPlayerId: string;
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  keysPressed,
  socketClient,
  mouseControls,
  clients,
  gameManager,
  currentPlayerId,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const cameraOffset = useRef(new THREE.Vector3(0, 3, -5)); // Camera position relative to player
  const cameraRotation = useRef({ horizontal: 0, vertical: 0.2 }); // Track camera rotation
  const skycam = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const isFirstMouse = useRef(true);
  const collisionSystem = useRef(new CollisionSystem());
  const lastTagCheck = useRef(0);

  // gated debug logger - only logs in dev
  const debug = (...args: unknown[]) => {
    // Vite exposes import.meta.env.DEV; fall back to false if undefined
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      console.log(...args);
    }
  };

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Handle mouse camera rotation
    if (mouseControls.leftClick) {
      if (isFirstMouse.current) {
        previousMouse.current.x = mouseControls.mouseX;
        previousMouse.current.y = mouseControls.mouseY;
        isFirstMouse.current = false;
      }

      const deltaX = mouseControls.mouseX - previousMouse.current.x;
      const deltaY = mouseControls.mouseY - previousMouse.current.y;

      const sensitivity = 0.002;
      // Left-drag rotates camera and player facing
      cameraRotation.current.horizontal -= deltaX * sensitivity;
      cameraRotation.current.vertical += deltaY * sensitivity;

      // Clamp vertical rotation
      cameraRotation.current.vertical = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, cameraRotation.current.vertical)
      );

      previousMouse.current.x = mouseControls.mouseX;
      previousMouse.current.y = mouseControls.mouseY;
    } else {
      isFirstMouse.current = true;
    }

    // Skycam: right-drag moves camera without rotating player
    if (mouseControls.rightClick) {
      if (isFirstMouse.current) {
        previousMouse.current.x = mouseControls.mouseX;
        previousMouse.current.y = mouseControls.mouseY;
        isFirstMouse.current = false;
      }

      const deltaX = mouseControls.mouseX - previousMouse.current.x;
      const deltaY = mouseControls.mouseY - previousMouse.current.y;
      const sensitivity = 0.003;

      // enable skycam flag
      skycam.current = true;

      // adjust camera rotation for skycam
      cameraRotation.current.horizontal -= deltaX * sensitivity;
      cameraRotation.current.vertical += deltaY * sensitivity;

      previousMouse.current.x = mouseControls.mouseX;
      previousMouse.current.y = mouseControls.mouseY;
    } else {
      // when right button released, disable skycam
      skycam.current = false;
    }

    // Calculate camera offset based on rotation
    const distance = 5;
    const offsetX =
      Math.sin(cameraRotation.current.horizontal) *
      Math.cos(cameraRotation.current.vertical) *
      distance;
    const offsetY = Math.sin(cameraRotation.current.vertical) * distance + 3;
    const offsetZ =
      Math.cos(cameraRotation.current.horizontal) *
      Math.cos(cameraRotation.current.vertical) *
      distance;

    cameraOffset.current.set(offsetX, offsetY, offsetZ);

    // Calculate direction based on keys pressed and camera rotation
    direction.current.set(0, 0, 0);

    if (keysPressed[W] || keysPressed[S] || keysPressed[A] || keysPressed[D]) {
      // Movement relative to camera direction
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();

      // Calculate forward and right vectors based on camera rotation
      forward.set(
        -Math.sin(cameraRotation.current.horizontal),
        0,
        -Math.cos(cameraRotation.current.horizontal)
      );
      right.set(
        Math.cos(cameraRotation.current.horizontal),
        0,
        -Math.sin(cameraRotation.current.horizontal)
      );

      if (keysPressed[W]) direction.current.add(forward);
      if (keysPressed[S]) direction.current.sub(forward);
      if (keysPressed[A]) direction.current.sub(right);
      if (keysPressed[D]) direction.current.add(right);

      // Normalize direction
      if (direction.current.length() > 0) {
        direction.current.normalize();

        // Apply speed (faster with shift)
        const speed = keysPressed[SHIFT] ? 5 : 2;
        velocity.current.copy(direction.current).multiplyScalar(speed * delta);

        // Calculate new position with collision detection
        const currentPosition = meshRef.current.position.clone();
        const newPosition = currentPosition.clone().add(velocity.current);

        // Check for collisions and get resolved position
        const resolvedPosition = collisionSystem.current.checkCollision(
          currentPosition,
          newPosition
        );

        // Check for player-to-player collisions and tagging
        const myId = socketClient?.id;
        if (myId && gameManager) {
          const currentPlayer = gameManager.getPlayers().get(myId);
          const gameState = gameManager.getGameState();
          const now = Date.now();

          for (const [clientId, clientData] of Object.entries(clients)) {
            if (clientId !== myId) {
              const otherPlayerPos = new THREE.Vector3(...clientData.position);
              const distance = resolvedPosition.distanceTo(otherPlayerPos);

              // Handle collision
              if (
                collisionSystem.current.checkPlayerCollision(
                  resolvedPosition,
                  otherPlayerPos
                )
              ) {
                // Simple push-back collision resolution
                const pushDirection = resolvedPosition
                  .clone()
                  .sub(otherPlayerPos)
                  .normalize();
                resolvedPosition.add(pushDirection.multiplyScalar(0.1));
              }

              // Handle tagging (only if current player is 'it' and close enough)
              if (
                gameState.isActive &&
                gameState.mode === "tag" &&
                currentPlayer?.isIt &&
                distance < 1.0 &&
                now - lastTagCheck.current > 1000
              ) {
                // 1 second cooldown

                debug(`Attempting to tag player ${clientId}`);
                if (gameManager.tagPlayer(myId, clientId)) {
                  socketClient.emit("player-tagged", {
                    taggerId: myId,
                    taggedId: clientId,
                  });
                  lastTagCheck.current = now;
                }
              }
            }
          }
        }

        // Move the character to resolved position
        meshRef.current.position.copy(resolvedPosition);

        // Debug: Log position changes (gated)
        if (
          Math.abs(direction.current.x) > 0 ||
          Math.abs(direction.current.z) > 0
        ) {
          debug("Character position:", meshRef.current.position.toArray());
        }

        // Rotate character to face movement direction only when not in skycam
        const angle = Math.atan2(direction.current.x, direction.current.z);
        if (!skycam.current) {
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
    }

    // Smooth third-person camera follow with rotation
    const idealCameraPosition = new THREE.Vector3(
      meshRef.current.position.x + cameraOffset.current.x,
      meshRef.current.position.y + cameraOffset.current.y,
      meshRef.current.position.z + cameraOffset.current.z
    );

    // Lerp camera position for smooth following
    // If skycam is active, raise the camera and lerp more slowly for a floating feel
    if (skycam.current) {
      const skyTarget = idealCameraPosition.clone();
      skyTarget.y += 12; // raise camera when in skycam
      state.camera.position.lerp(skyTarget, 0.06);
    } else {
      state.camera.position.lerp(idealCameraPosition, 0.1);
    }

    // Make camera look at the character
    state.camera.lookAt(
      meshRef.current.position.x,
      meshRef.current.position.y + 0.5,
      meshRef.current.position.z
    );
  });

  const currentPlayer = gameManager?.getPlayers().get(currentPlayerId);
  const isIt = currentPlayer?.isIt || false;

  return (
    <group ref={meshRef} position={[0, 0.5, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color={isIt ? "#ff4444" : "#4a90e2"} />
      </mesh>

      {/* Glow effect for 'it' player */}
      {isIt && (
        <mesh>
          <boxGeometry args={[0.6, 1.1, 0.6]} />
          <meshBasicMaterial color="#ff6666" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
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
  const [mouseControls, setMouseControls] = useState({
    leftClick: false,
    rightClick: false,
    mouseX: 0,
    mouseY: 0,
  });
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    mode: "none",
    isActive: false,
    timeRemaining: 0,
    scores: {},
  });
  const [gamePlayers, setGamePlayers] = useState<Map<string, Player>>(
    new Map()
  );
  const [currentGameManager, setCurrentGameManager] =
    useState<GameManager | null>(null);
  // Generate stable local ID using useState with lazy initializer (React-approved pattern)
  const [localPlayerId] = useState(
    () => `local-${Math.random().toString(36).slice(2, 8)}`
  );
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const keyDisplayRef = useRef<KeyDisplay | null>(null);
  const lastEmitTime = useRef(0);
  const gameManager = useRef<GameManager | null>(null);

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
      debug(
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
      debug("Socket connected:", socket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;

      // Initialize game manager
      if (!gameManager.current) {
        const newGameManager = new GameManager();
        newGameManager.setCallbacks({
          onGameStateUpdate: setGameState,
          onPlayerUpdate: setGamePlayers,
        });
        gameManager.current = newGameManager;
        setCurrentGameManager(newGameManager);
      }

      // Add this player to game manager
      if (socket.id) {
        gameManager.current.addPlayer({
          id: socket.id,
          name: `Player ${socket.id.slice(-4)}`,
          position: [0, 0.5, 0],
          rotation: [0, 0, 0],
        });
      }
    });

    socket.on("disconnect", (reason) => {
      debug("Socket disconnected:", reason);
      setIsConnected(false);

      // Remove player from game manager
      if (gameManager.current && socket.id) {
        gameManager.current.removePlayer(socket.id);
      }

      // Attempt manual reconnection with exponential backoff
      if (reason === "io server disconnect" || reason === "transport close") {
        attemptReconnect();
      }
    });

    socket.on("connect_error", (error) => {
      // Always log connection errors regardless of DEV flag
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
    debug("Setting up keyboard controls");
    keyDisplayRef.current = new KeyDisplay();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      debug("Key down:", key);

      // Handle chat toggle
      if (key === "c" && !chatVisible) {
        setChatVisible(true);
        return;
      }

      // Only process movement keys if chat is not visible
      if (!chatVisible && [W, A, S, D, SHIFT].includes(key)) {
        e.preventDefault(); // Prevent default browser behavior
        setKeysPressed((prev) => ({ ...prev, [key]: true }));
        keyDisplayRef.current?.down(key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      debug("Key up:", key);

      // Only process movement keys if chat is not visible
      if (!chatVisible && [W, A, S, D, SHIFT].includes(key)) {
        e.preventDefault();
        setKeysPressed((prev) => ({ ...prev, [key]: false }));
        keyDisplayRef.current?.up(key);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Prevent default context menu on right-click
      if (e.button === 2) {
        e.preventDefault();
      }

      setMouseControls((prev) => ({
        ...prev,
        leftClick: e.button === 0 ? true : prev.leftClick,
        rightClick: e.button === 2 ? true : prev.rightClick,
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      setMouseControls((prev) => ({
        ...prev,
        leftClick: e.button === 0 ? false : prev.leftClick,
        rightClick: e.button === 2 ? false : prev.rightClick,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMouseControls((prev) => ({
        ...prev,
        mouseX: e.clientX,
        mouseY: e.clientY,
      }));
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Disable right-click context menu
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      debug("Cleaning up keyboard and mouse controls");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", handleContextMenu);
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
  }, [chatVisible]);

  useEffect(() => {
    if (!socketClient) return;

    socketClient.on("move", (clients: Clients) => {
      setClients(clients);

      // Update game manager with player positions
      if (gameManager.current) {
        Object.entries(clients).forEach(([id, data]) => {
          gameManager.current?.updatePlayer(id, {
            position: data.position,
            rotation: data.rotation,
          });
        });
      }
    });

    socketClient.on("chat-message", (message: ChatMessage) => {
      setChatMessages((prev) => {
        if (prev.length < MAX_CHAT_MESSAGES) {
          return [...prev, message];
        }
        // Avoid copying large arrays every time: rotate
        const copied = prev.slice();
        copied.shift();
        copied.push(message);
        return copied;
      });
    });

    // Game-related socket events
    socketClient.on(
      "game-start",
      (gameData: { mode: string; duration: number }) => {
        debug("Game started:", gameData);
        if (gameManager.current) {
          gameManager.current.startTagGame(gameData.duration);
        }
      }
    );

    socketClient.on(
      "player-tagged",
      (data: { taggerId: string; taggedId: string }) => {
        debug("Player tagged:", data);
        if (gameManager.current) {
          gameManager.current.tagPlayer(data.taggerId, data.taggedId);
        }
      }
    );

    return () => {
      socketClient.off("move");
      socketClient.off("chat-message");
      socketClient.off("game-start");
      socketClient.off("player-tagged");
    };
  }, [socketClient]);

  const handleSendMessage = useCallback(
    (message: string) => {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        playerId: socketClient?.id || localPlayerId,
        playerName: socketClient?.id
          ? `Player ${socketClient.id.slice(-4)}`
          : "Solo Player",
        message,
        timestamp: Date.now(),
      };

      // Add to local messages immediately for responsive UI
      setChatMessages((prev) => [
        ...prev.slice(-(MAX_CHAT_MESSAGES - 1)),
        chatMessage,
      ]);

      // Emit to server if connected (optional for solo mode)
      if (socketClient && isConnected) {
        socketClient.emit("chat-message", chatMessage);
      }
    },
    [socketClient, isConnected, localPlayerId]
  );

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  const handleStartGame = (mode: string) => {
    if (!gameManager.current) return;

    // If we're offline (no socket client), ensure there is a local player in the game manager
    const currentId = socketClient?.id || localPlayerId;
    if (!gameManager.current.getPlayers().has(currentId)) {
      gameManager.current.addPlayer({
        id: currentId,
        name: `Player ${currentId.slice(-4)}`,
        position: [0, 0.5, 0],
        rotation: [0, 0, 0],
      });
      // If we're using a local id, also update local gamePlayers map for UI
      setGamePlayers(new Map(gameManager.current.getPlayers()));
    }

    if (mode === "tag") {
      const started = gameManager.current.startTagGame(180); // 3 minutes
      if (started) {
        // Only emit to server when connected
        if (socketClient && isConnected) {
          socketClient.emit("game-start", { mode: "tag", duration: 180 });
        }
      }
    }
  };

  const handleEndGame = () => {
    if (!socketClient || !gameManager.current) return;

    gameManager.current.endGame();
    socketClient.emit("game-end");
  };

  // Update game timer
  useEffect(() => {
    if (!gameState.isActive || !gameManager.current) return;

    const interval = setInterval(() => {
      gameManager.current!.updateGameTimer(1); // 1 second
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isActive]);

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

    debug("Emitting movement:", keysPressed);
    // Emit basic movement state for now (will integrate with CharacterControls later)
    socketClient.emit("move", { keysPressed });
  }, [keysPressed, socketClient, isConnected]);

  return (
    <>
      <Tutorial />
      <HelpModal />
      <ThemeToggle />
      <PerformanceMonitor onPerformanceChange={setCurrentFPS} />
      <QualitySettings onChange={setQuality} currentFPS={currentFPS} />
      <ChatBox
        isVisible={chatVisible}
        onToggle={toggleChat}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        currentPlayerId={socketClient?.id || ""}
      />
      <GameUI
        gameState={gameState}
        players={gamePlayers}
        currentPlayerId={socketClient?.id || ""}
        onStartGame={handleStartGame}
        onEndGame={handleEndGame}
      />

      {/* Connection Status - Always show, centered at top */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "6px 12px",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          color: "rgba(255, 255, 255, 0.5)",
          borderRadius: "4px",
          zIndex: 1000,
          pointerEvents: "none", // Click-through
          fontSize: "12px",
          fontFamily: "monospace",
          opacity: 0.5,
        }}
      >
        Solo — Offline
      </div>
      <Canvas
        camera={{ position: [0, 3, -5], near: 0.1, far: 1000 }}
        shadows={qualitySettings.shadows}
        dpr={qualitySettings.pixelRatio}
        gl={{ antialias: qualitySettings.antialias }}
      >
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

        {/* Environment Obstacles */}
        {/* Central pillar - moved to side so it doesn't block spawn */}
        <mesh position={[8, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#666666" />
        </mesh>

        {/* Corner obstacles */}
        <mesh position={[17.5, 1.5, 17.5]} castShadow receiveShadow>
          <boxGeometry args={[5, 3, 5]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>

        <mesh position={[-17.5, 1.5, -17.5]} castShadow receiveShadow>
          <boxGeometry args={[5, 3, 5]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>

        <mesh position={[17.5, 1.5, -17.5]} castShadow receiveShadow>
          <boxGeometry args={[5, 3, 5]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>

        <mesh position={[-17.5, 1.5, 17.5]} castShadow receiveShadow>
          <boxGeometry args={[5, 3, 5]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>

        {/* Ground plane for better visibility */}
        <mesh
          position={[0, -0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        <PlayerCharacter
          keysPressed={keysPressed}
          socketClient={socketClient}
          mouseControls={mouseControls}
          clients={clients}
          gameManager={currentGameManager}
          currentPlayerId={socketClient?.id || ""}
        />
        {Object.keys(clients)
          .filter((clientKey) => socketClient && clientKey !== socketClient.id)
          .map((client) => {
            const { position, rotation } = clients[client];
            const player = gamePlayers.get(client);
            return (
              <UserWrapper
                key={client}
                id={client}
                position={position}
                rotation={rotation}
                isIt={player?.isIt || false}
              />
            );
          })}
      </Canvas>
    </>
  );
};

export default Solo;
