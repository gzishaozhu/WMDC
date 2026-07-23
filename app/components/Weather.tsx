"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type WeatherMode = "clear" | "rain" | "storm";

export function Weather({ mode }: { mode: WeatherMode }) {
  const points = useRef<THREE.Points>(null);
  const flash = useRef<THREE.PointLight>(null);
  const count = mode === "storm" ? 2400 : 1100;
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 42;
      values[i * 3 + 1] = Math.random() * 24;
      values[i * 3 + 2] = (Math.random() - 0.5) * 34;
    }
    return values;
  }, [count]);

  useFrame((_, delta) => {
    if (!points.current || mode === "clear") return;
    const array = points.current.geometry.attributes.position.array as Float32Array;
    const speed = mode === "storm" ? 17 : 9;
    for (let i = 1; i < array.length; i += 3) {
      array[i] -= delta * speed;
      if (array[i] < 0) array[i] = 24;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    if (flash.current && mode === "storm") {
      const burst = Math.sin(Date.now() * 0.0017) > 0.985;
      flash.current.intensity = burst ? 55 : Math.max(0, flash.current.intensity - delta * 90);
    }
  });

  if (mode === "clear") return null;
  return <>
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={mode === "storm" ? "#d9f2ff" : "#e9f7ff"} size={mode === "storm" ? 0.09 : 0.055} transparent opacity={0.72} depthWrite={false} />
    </points>
    {mode === "storm" && <pointLight ref={flash} position={[-8, 18, -10]} color="#dcecff" intensity={0} distance={70} />}
  </>;
}
