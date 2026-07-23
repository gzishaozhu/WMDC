"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function SimulationActors({ minute }: { minute: number }) {
  const crowd = useRef<THREE.Group>(null);
  const vehicle = useRef<THREE.Group>(null);
  const active = minute >= 28;

  useFrame((state) => {
    if (!active) return;
    const t = Math.min(1, (minute - 28) / 32);
    if (crowd.current) {
      crowd.current.position.x = THREE.MathUtils.lerp(5.5, -8.5, t);
      crowd.current.position.z = 2.5 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    }
    if (vehicle.current) {
      vehicle.current.position.z = THREE.MathUtils.lerp(-11, 2, t);
    }
  });

  if (!active) return null;
  return (
    <group>
      <group ref={crowd} position={[5.5, 0, 2.5]}>
        {Array.from({ length: 18 }).map((_, index) => (
          <mesh key={index} position={[(index % 6) * 0.32, 0.26, Math.floor(index / 6) * 0.36]}>
            <capsuleGeometry args={[0.08, 0.22, 3, 6]} />
            <meshStandardMaterial color={index % 3 === 0 ? "#f0bc62" : "#e9e7dc"} />
          </mesh>
        ))}
      </group>
      <group ref={vehicle} position={[0, 0.35, -11]}>
        <mesh castShadow><boxGeometry args={[1.1, 0.55, 1.8]} /><meshStandardMaterial color="#e85e3d" /></mesh>
        <mesh position={[0, 0.42, -0.15]}><boxGeometry args={[0.7, 0.3, 0.65]} /><meshStandardMaterial color="#dcebed" /></mesh>
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[-2, 0.09, 2.7]}>
        <planeGeometry args={[14, 0.14]} />
        <meshBasicMaterial color="#f2c54c" transparent opacity={0.75} />
      </mesh>
    </group>
  );
}
