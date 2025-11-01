import { useState, useEffect } from "react";

export type Orientation = "portrait" | "landscape";

export const useOrientation = (): Orientation => {
  const getOrientation = (): Orientation => {
    if (typeof window === "undefined") return "landscape";
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  };

  const [orientation, setOrientation] = useState<Orientation>(getOrientation);

  useEffect(() => {
    const handleResize = () => {
      setOrientation(getOrientation());
    };

    // Listen to both resize and orientation change events
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return orientation;
};
