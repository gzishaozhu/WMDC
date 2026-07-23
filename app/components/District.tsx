"use client";

import { Text } from "@react-three/drei";

type Props = {
  selected: string;
  onSelect: (name: string) => void;
  floodProgress: number;
};

const buildings = [
  { name: "滨水文化中心", p: [-7, 1.8, -4] as const, s: [5, 3.6, 4] as const, color: "#d7c7a5" },
  { name: "中央商业馆", p: [0, 2.6, -4] as const, s: [5, 5.2, 4] as const, color: "#bd765d" },
  { name: "交通枢纽", p: [7, 2.1, -4] as const, s: [5, 4.2, 4] as const, color: "#5e7d83" },
  { name: "沿河市集", p: [-6, 1.25, 4] as const, s: [6, 2.5, 3.6] as const, color: "#d39c52" },
  { name: "城市展厅", p: [1, 1.55, 4] as const, s: [5, 3.1, 3.6] as const, color: "#a84f43" },
  { name: "社区服务站", p: [7, 1.25, 4] as const, s: [4, 2.5, 3.6] as const, color: "#718b70" },
];

export function District({ selected, onSelect, floodProgress }: Props) {
  const waterLevel = Math.max(0, (floodProgress - 18) / 100);
  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.05, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#b8b29f" roughness={0.95} />
      </mesh>

      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <planeGeometry args={[3.2, 30]} />
        <meshStandardMaterial color="#414b4c" roughness={0.85} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <planeGeometry args={[40, 2.7]} />
        <meshStandardMaterial color="#414b4c" roughness={0.85} />
      </mesh>

      {buildings.map((building) => {
        const active = selected === building.name;
        return (
          <group key={building.name}>
            <mesh
              castShadow
              receiveShadow
              position={building.p}
              scale={active ? 1.04 : 1}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(building.name);
              }}
              onPointerOver={() => { document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { document.body.style.cursor = "default"; }}
            >
              <boxGeometry args={building.s} />
              <meshStandardMaterial
                color={active ? "#f0d475" : building.color}
                roughness={0.72}
                metalness={0.03}
              />
            </mesh>
            {active && (
              <Text
                position={[building.p[0], building.p[1] + building.s[1] / 2 + 1.1, building.p[2]]}
                fontSize={0.5}
                color="#142c34"
                anchorX="center"
              >
                {building.name}
              </Text>
            )}
          </group>
        );
      })}

      {Array.from({ length: 14 }).map((_, index) => (
        <mesh key={index} position={[-10 + index * 1.55, 0.35, 8.4]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.7, 8]} />
          <meshStandardMaterial color="#355c48" />
        </mesh>
      ))}

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 12]}>
        <planeGeometry args={[40, 7]} />
        <meshStandardMaterial color="#397d8d" roughness={0.2} metalness={0.18} />
      </mesh>
      {waterLevel > 0 && (
        <>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.05 + waterLevel * 0.45, 7.2]}>
            <planeGeometry args={[40, 8 + floodProgress * 0.11]} />
            <meshStandardMaterial color="#287b98" transparent opacity={0.68} roughness={0.16} metalness={0.12} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.06 + waterLevel * 0.32, 0]}>
            <planeGeometry args={[3.1 + floodProgress * 0.035, 18]} />
            <meshStandardMaterial color="#3e91a9" transparent opacity={0.55} roughness={0.12} />
          </mesh>
        </>
      )}
    </group>
  );
}
