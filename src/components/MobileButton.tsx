import React, { useRef, useEffect, useCallback } from "react";
import "../styles/MobileButton.css";

interface MobileButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
  onRelease: () => void;
  position?: "bottom-center" | "bottom-right";
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  label,
  icon,
  onPress,
  onRelease,
  position = "bottom-center",
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const pressedRef = useRef(false);

  const handlePress = useCallback(() => {
    if (!pressedRef.current) {
      pressedRef.current = true;
      onPress();
    }
  }, [onPress]);

  const handleRelease = useCallback(() => {
    if (pressedRef.current) {
      pressedRef.current = false;
      onRelease();
    }
  }, [onRelease]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Use native events with passive: false
    // eslint-disable-next-line no-undef
    const touchStartHandler = (e: TouchEvent) => {
      e.preventDefault();
      button.classList.add("pressed");
      handlePress();
    };

    // eslint-disable-next-line no-undef
    const touchEndHandler = (e: TouchEvent) => {
      e.preventDefault();
      button.classList.remove("pressed");
      handleRelease();
    };

    button.addEventListener("touchstart", touchStartHandler, {
      passive: false,
    });
    button.addEventListener("touchend", touchEndHandler, { passive: false });
    button.addEventListener("touchcancel", touchEndHandler, { passive: false });

    return () => {
      button.removeEventListener("touchstart", touchStartHandler);
      button.removeEventListener("touchend", touchEndHandler);
      button.removeEventListener("touchcancel", touchEndHandler);
      if (pressedRef.current) {
        handleRelease();
      }
    };
  }, [handlePress, handleRelease]);

  return (
    <div ref={buttonRef} className={`mobile-button ${position}`}>
      {icon && <span className="mobile-button-icon">{icon}</span>}
      <span className="mobile-button-label">{label}</span>
    </div>
  );
};
