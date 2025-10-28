import * as React from "react";
import { GameState, Player } from "./GameManager";

interface GameUIProps {
  gameState: GameState;
  players: Map<string, Player>;
  currentPlayerId: string;
  onStartGame: (mode: string) => void;
  onEndGame: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  players,
  currentPlayerId,
  onStartGame,
  onEndGame,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentPlayer = players.get(currentPlayerId);
  const itPlayer =
    gameState.mode === "tag" ? players.get(gameState.itPlayerId || "") : null;

  // Main game status display (always visible during active game)
  if (gameState.isActive) {
    return (
      <div
        style={{
          position: "fixed",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 20px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          color: "white",
          fontFamily: "monospace",
          fontSize: "14px",
          zIndex: 1000,
          minWidth: "300px",
          textAlign: "center",
        }}
      >
        <div
          style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "bold" }}
        >
          {gameState.mode.toUpperCase()} GAME
        </div>

        <div style={{ marginBottom: "8px" }}>
          Time: {formatTime(gameState.timeRemaining)}
        </div>

        {gameState.mode === "tag" && (
          <>
            <div
              style={{
                marginBottom: "8px",
                padding: "6px 12px",
                backgroundColor: currentPlayer?.isIt
                  ? "rgba(255, 100, 100, 0.3)"
                  : "rgba(100, 255, 100, 0.3)",
                borderRadius: "4px",
                border: currentPlayer?.isIt
                  ? "1px solid #ff6464"
                  : "1px solid #64ff64",
              }}
            >
              {currentPlayer?.isIt
                ? "YOU ARE IT!"
                : `${itPlayer?.name || "Someone"} is IT`}
            </div>

            {currentPlayer?.isIt && (
              <div style={{ fontSize: "12px", color: "#ffff64" }}>
                Tag someone to pass it on!
              </div>
            )}
          </>
        )}

        <button
          onClick={onEndGame}
          style={{
            marginTop: "8px",
            padding: "4px 8px",
            backgroundColor: "rgba(255, 100, 100, 0.8)",
            border: "1px solid #ff6464",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          End Game
        </button>
      </div>
    );
  }

  // Game lobby/start screen
  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        right: "20px",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        color: "white",
        fontFamily: "monospace",
        fontSize: "12px",
        zIndex: 1000,
        minWidth: "200px",
      }}
    >
      <div
        style={{ marginBottom: "12px", fontSize: "14px", fontWeight: "bold" }}
      >
        Game Modes
      </div>

      <div style={{ marginBottom: "8px", color: "#aaa" }}>
        Players: {players.size}
      </div>

      {players.size >= 2 || players.size === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => onStartGame("tag")}
            style={{
              padding: "8px 16px",
              backgroundColor: "rgba(74, 144, 226, 0.8)",
              border: "1px solid #4a90e2",
              borderRadius: "4px",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Start Tag Game {players.size === 0 ? "(Solo Practice)" : ""}
          </button>

          <div style={{ fontSize: "10px", color: "#888", textAlign: "center" }}>
            {players.size === 0
              ? "Practice mode • No opponents"
              : "3 minute rounds • Tag to pass"}
          </div>
        </div>
      ) : (
        <div style={{ color: "#888", textAlign: "center" }}>
          Need at least 2 players to start a game
        </div>
      )}
    </div>
  );
};

export default GameUI;
