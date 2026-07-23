"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Crowd({ color = "#e9e7dc" }: { color?: string }) {
  return <group>
    {Array.from({ length: 15 }).map((_, index) => (
      <mesh key={index} position={[(index % 5) * 0.29, 0.25, Math.floor(index / 5) * 0.34]}>
        <capsuleGeometry args={[0.075, 0.2, 3, 6]} />
        <meshStandardMaterial color={index % 4 === 0 ? "#f0bc62" : color} />
      </mesh>
    ))}
  </group>;
}

export function SimulationActors({ minute, mitigated }: { minute: number; mitigated: boolean }) {
  const westCrowd = useRef<THREE.Group>(null);
  const northCrowd = useRef<THREE.Group>(null);
  const vehicle = useRef<THREE.Group>(null);
  const pump = useRef<THREE.Mesh>(null);
  const active = minute >= 28;

  useFrame((state) => {
    if (!active) return;
    const t = Math.min(1, (minute - 28) / 32);
    if (westCrowd.current) {
      westCrowd.current.position.x = THREE.MathUtils.lerp(5.5, -8.5, t);
      westCrowd.current.position.z = 2.5 + Math.sin(state.clock.elapsedTime * 1.8) * 0.07;
    }
    if (northCrowd.current) {
      northCrowd.current.position.x = THREE.MathUtils.lerp(6.5, 1.2, t);
      northCrowd.current.position.z = THREE.MathUtils.lerp(-2, -9, t);
    }
    if (vehicle.current) {
      vehicle.current.position.z = THREE.MathUtils.lerp(-11, mitigated ? 1.5 : -2.5, t);
    }
    if (pump.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.12;
      pump.current.scale.setScalar(pulse);
    }
  });

  if (!active) return null;
  return <group>
    <group ref={westCrowd} position={[5.5, 0, 2.5]}><Crowd /></group>
    <group ref={northCrowd} position={[6.5, 0, -2]}><Crowd color="#b9d4d2" /></group>
    <group ref={vehicle} position={[0, 0.35, -11]}>
      <mesh castShadow><boxGeometry args={[1.1, 0.55, 1.8]} /><meshStandardMaterial color="#e85e3d" /></mesh>
      <mesh position={[0, 0.42, -0.15]}><boxGeometry args={[0.7, 0.3, 0.65]} /><meshStandardMaterial color="#dcebed" /></mesh>
      <pointLight position={[0, 0.7, 0]} color="#ff6b45" intensity={3} distance={5} />
    </group>
    {mitigated && <mesh ref={pump} position={[1.9, 0.34, 5.8]}>
      <cylinderGeometry args={[0.34, 0.42, 0.68, 10]} />
      <meshStandardMaterial color="#ff7d43" emissive="#e8502e" emissiveIntensity={0.45} />
    </mesh>}
    <mesh rotation-x={-Math.PI / 2} position={[-2, 0.09, 2.7]}>
      <planeGeometry args={[14, 0.14]} /><meshBasicMaterial color="#f2c54c" transparent opacity={0.75} />
    </mesh>
    <mesh rotation-x={-Math.PI / 2} rotation-z={-0.62} position={[3.8, 0.1, -5.6]}>
      <planeGeometry args={[9, 0.13]} /><meshBasicMaterial color="#6fe0da" transparent opacity={0.7} />
    </mesh>
  </group>;
}
