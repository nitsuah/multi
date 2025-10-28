import * as React from "react";
import { useState, useEffect } from "react";
import "../styles/HelpModal.css";

const HelpModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyPress = (e: any) => {
      if (e.key.toLowerCase() === "h") {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="help-modal-overlay"
      onClick={() => setIsOpen(false)}
      role="button"
      aria-label="Close help modal"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
    >
      <div
        className="help-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.stopPropagation()}
        aria-label="Help modal content"
      >
        <div className="help-modal-header">
          <h2>Help & Controls</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="help-close-button"
          >
            ×
          </button>
        </div>
        <div className="help-modal-body">
          <section className="help-section">
            <h3>Movement</h3>
            <ul>
              <li>
                <kbd>W</kbd> Move Forward
              </li>
              <li>
                <kbd>A</kbd> Move Left
              </li>
              <li>
                <kbd>S</kbd> Move Backward
              </li>
              <li>
                <kbd>D</kbd> Move Right
              </li>
              <li>
                <kbd>SHIFT</kbd> Run (hold while moving)
              </li>
            </ul>
          </section>

          <section className="help-section">
            <h3>Interface</h3>
            <ul>
              <li>
                <kbd>H</kbd> Toggle this help menu
              </li>
              <li>☀️/🌙 Toggle dark/light theme (top-left)</li>
              <li>⚙️ Adjust graphics quality (top-right)</li>
              <li>FPS counter in top-right corner</li>
            </ul>
          </section>

          <section className="help-section">
            <h3>Multiplayer</h3>
            <ul>
              <li>Your character is the blue box</li>
              <li>Other players appear as colored boxes</li>
              <li>Movement is synchronized in real-time</li>
            </ul>
          </section>
        </div>
        <div className="help-modal-footer">
          <p className="help-hint">Press H or click outside to close</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
