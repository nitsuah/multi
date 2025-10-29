import React, { useRef, useCallback, useEffect } from "react";
import "../styles/MobileJoystick.css";

interface JoystickProps {
  side: "left" | "right";
  label: string;
  onMove: (x: number, y: number) => void;
}

export const MobileJoystick: React.FC<JoystickProps> = ({
  side,
  label,
  onMove,
}) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const touchIdRef = useRef<number | null>(null);

  const maxDistance = 50; // Max distance knob can move from center

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!baseRef.current || !knobRef.current) return;

      const baseRect = baseRef.current.getBoundingClientRect();
      const baseCenterX = baseRect.left + baseRect.width / 2;
      const baseCenterY = baseRect.top + baseRect.height / 2;

      let deltaX = clientX - baseCenterX;
      let deltaY = clientY - baseCenterY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * maxDistance;
        deltaY = Math.sin(angle) * maxDistance;
      }

      knobRef.current.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;
      onMove(normalizedX, normalizedY);
    },
    [maxDistance, onMove]
  );

  const handleEnd = useCallback(() => {
    if (!knobRef.current || !baseRef.current) return;

    knobRef.current.style.transform = "translate(-50%, -50%)";
    baseRef.current.classList.remove("active");
    activeRef.current = false;
    touchIdRef.current = null;
    onMove(0, 0);
  }, [onMove]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!baseRef.current) return;

      const touch = e.touches[0];
      if (touch) {
        touchIdRef.current = touch.identifier;
        baseRef.current.classList.add("active");
        activeRef.current = true;
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!activeRef.current) return;

      const touch = Array.from(e.touches).find(
        (t) => t.identifier === touchIdRef.current
      );
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touchEnded = !Array.from(e.touches).some(
        (t) => t.identifier === touchIdRef.current
      );
      if (touchEnded) {
        handleEnd();
      }
    },
    [handleEnd]
  );

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (activeRef.current) {
        handleEnd();
      }
    };
  }, [handleEnd]);

  return (
    <div className={`joystick-container ${side}`}>
      <div className="joystick-label">{label}</div>
      <div
        ref={baseRef}
        className="joystick-base"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div ref={knobRef} className="joystick-knob" />
      </div>
    </div>
  );
};
