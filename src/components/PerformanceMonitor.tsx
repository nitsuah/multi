import React, { useState, useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  onPerformanceChange?: (fps: number) => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ onPerformanceChange }) => {
  const [fps, setFps] = useState<number>(60);
  const [show, setShow] = useState<boolean>(true);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    // Initialize lastFrameTimeRef inside useEffect
    lastFrameTimeRef.current = window.performance.now();
    
    const measureFrame = () => {
      const now = window.performance.now();
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Store frame times (keep last 60 frames)
      frameTimesRef.current.push(delta);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calculate FPS every 30 frames
      if (frameTimesRef.current.length >= 30) {
        const avgDelta = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const currentFps = Math.round(1000 / avgDelta);
        setFps(currentFps);
        
        if (onPerformanceChange) {
          onPerformanceChange(currentFps);
        }
      }

      rafIdRef.current = window.requestAnimationFrame(measureFrame);
    };

    rafIdRef.current = window.requestAnimationFrame(measureFrame);

    return () => {
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [onPerformanceChange]);

  const getFPSColor = () => {
    if (fps >= 50) return '#00ff00'; // Green
    if (fps >= 30) return '#ffaa00'; // Orange
    return '#ff0000'; // Red
  };

  if (!show) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setShow(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setShow(false);
        }
      }}
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: getFPSColor(),
        padding: '8px 12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 9999,
        userSelect: 'none',
        cursor: 'pointer',
      }}
      title="Click to hide"
    >
      FPS: {fps}
    </div>
  );
};

export default PerformanceMonitor;
