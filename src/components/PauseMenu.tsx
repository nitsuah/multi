import * as React from "react";

interface PauseMenuProps {
  isVisible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  isVisible,
  onResume,
  onRestart,
  onQuit,
}) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "12px",
          padding: "30px 40px",
          minWidth: "300px",
          textAlign: "center",
          color: "white",
          fontFamily: "monospace",
        }}
      >
        <h2
          style={{
            margin: "0 0 20px 0",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          ⏸️ PAUSED
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={onResume}
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(74, 144, 226, 0.9)",
              border: "1px solid #4a90e2",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(74, 144, 226, 1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(74, 144, 226, 0.9)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ▶️ Resume
          </button>

          <button
            onClick={onRestart}
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(255, 165, 0, 0.9)",
              border: "1px solid #ffa500",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 165, 0, 1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 165, 0, 0.9)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            🔄 Restart
          </button>

          <button
            onClick={onQuit}
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(255, 100, 100, 0.9)",
              border: "1px solid #ff6464",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 100, 100, 1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 100, 100, 0.9)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            🚪 Quit to Menu
          </button>
        </div>

        <div
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#888",
          }}
        >
          Press ESC to resume
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
