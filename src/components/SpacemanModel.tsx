import React from "react";

interface SpacemanModelProps {
  color?: string;
  isIt?: boolean;
}

/**
 * Simple geometric spaceman character made from primitives
 * Body: cylinder, Head: sphere, Arms/Legs: cylinders, Helmet: glass sphere
 */
const SpacemanModel: React.FC<SpacemanModelProps> = ({
  color = "#4a90e2",
  isIt = false,
}) => {
  return (
    <group scale={0.5}>
      {/* Body - cylinder */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.8, 16]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Head - sphere */}
      <mesh castShadow position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#f5f5dc" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Helmet visor - transparent sphere */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.27, 16, 16]} />
        <meshStandardMaterial
          color="#88ccff"
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Left arm */}
      <mesh castShadow position={[-0.4, 0.7, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Right arm */}
      <mesh castShadow position={[0.4, 0.7, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Left leg */}
      <mesh castShadow position={[-0.15, 0.0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Right leg */}
      <mesh castShadow position={[0.15, 0.0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Backpack - small box on back */}
      <mesh castShadow position={[0, 0.7, -0.25]}>
        <boxGeometry args={[0.35, 0.5, 0.15]} />
        <meshStandardMaterial color="#666666" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Antenna on helmet */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
        <meshStandardMaterial color="#ffaa00" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Antenna tip - glowing sphere */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={isIt ? "#ff0000" : "#00ff00"} />
      </mesh>

      {/* Glow effect for 'it' player */}
      {isIt && (
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#ff6666" transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
};

export default SpacemanModel;
