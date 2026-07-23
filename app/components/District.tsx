"use client";

import { Text } from "@react-three/drei";

type Layer = "city" | "risk" | "elevation";
type Props = {
  selected: string;
  onSelect: (name: string) => void;
  floodProgress: number;
  layer: Layer;
  mitigated?: boolean;
};

const buildings = [
  { name: "滨水文化中心", p: [-7, 1.8, -4] as const, s: [5, 3.6, 4] as const, color: "#d7c7a5", roof: "terrace" },
  { name: "中央商业馆", p: [0, 2.6, -4] as const, s: [5, 5.2, 4] as const, color: "#bd765d", roof: "tower" },
  { name: "交通枢纽", p: [7, 2.1, -4] as const, s: [5, 4.2, 4] as const, color: "#5e7d83", roof: "canopy" },
  { name: "沿河市集", p: [-6, 1.25, 4] as const, s: [6, 2.5, 3.6] as const, color: "#d39c52", roof: "saw" },
  { name: "城市展厅", p: [1, 1.55, 4] as const, s: [5, 3.1, 3.6] as const, color: "#a84f43", roof: "terrace" },
  { name: "社区服务站", p: [7, 1.25, 4] as const, s: [4, 2.5, 3.6] as const, color: "#718b70", roof: "canopy" },
];

function Building({
  data, active, layer, onSelect,
}: {
  data: (typeof buildings)[number]; active: boolean; layer: Layer; onSelect: () => void;
}) {
  const riskColor = data.name === "交通枢纽" ? "#d84437" : data.name === "城市展厅" ? "#ed9c43" : "#7d9d83";
  const elevationColor = data.p[0] > 3 ? "#4b8ba0" : data.p[0] > -3 ? "#70a483" : "#d3b765";
  const color = active ? "#f0d475" : layer === "risk" ? riskColor : layer === "elevation" ? elevationColor : data.color;
  const floors = Math.max(2, Math.round(data.s[1] / 0.9));

  return (
    <group>
      <mesh
        castShadow receiveShadow position={data.p} scale={active ? 1.035 : 1}
        onClick={(event) => { event.stopPropagation(); onSelect(); }}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <boxGeometry args={data.s} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.04} />
      </mesh>
      {Array.from({ length: floors }).map((_, floor) => (
        <group key={floor} position={[data.p[0], data.p[1] - data.s[1] / 2 + 0.55 + floor * 0.82, data.p[2] + data.s[2] / 2 + 0.012]}>
          {[-1.5, -0.5, 0.5, 1.5].map((offset) => (
            <mesh key={offset} position={[offset * Math.min(1, data.s[0] / 5), 0, 0]}>
              <planeGeometry args={[0.52, 0.38]} />
              <meshStandardMaterial color="#bfe1e1" emissive="#7ba8a9" emissiveIntensity={0.2} roughness={0.18} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[data.p[0], data.p[1] + data.s[1] / 2 + 0.16, data.p[2]]} castShadow>
        {data.roof === "tower" ? <cylinderGeometry args={[0.8, 1.1, 0.55, 6]} /> : <boxGeometry args={[data.s[0] * 0.72, 0.28, data.s[2] * 0.68]} />}
        <meshStandardMaterial color={data.roof === "canopy" ? "#dce7df" : "#485b57"} />
      </mesh>
      {active && (
        <Text position={[data.p[0], data.p[1] + data.s[1] / 2 + 1.15, data.p[2]]} fontSize={0.48} color="#142c34" anchorX="center">
          {data.name}
        </Text>
      )}
    </group>
  );
}

export function District({ selected, onSelect, floodProgress, layer, mitigated = false }: Props) {
  const effectiveProgress = mitigated ? floodProgress * 0.58 : floodProgress;
  const waterLevel = Math.max(0, (effectiveProgress - 18) / 100);
  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.05, 0]}>
        <planeGeometry args={[40, 30]} /><meshStandardMaterial color="#b8b29f" roughness={0.95} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <planeGeometry args={[3.2, 30]} /><meshStandardMaterial color="#414b4c" roughness={0.85} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <planeGeometry args={[40, 2.7]} /><meshStandardMaterial color="#414b4c" roughness={0.85} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.045, 8.2]}>
        <planeGeometry args={[40, 2.4]} /><meshStandardMaterial color="#c4ad84" roughness={0.9} />
      </mesh>

      {buildings.map((building) => (
        <Building key={building.name} data={building} active={selected === building.name} layer={layer} onSelect={() => onSelect(building.name)} />
      ))}

      {Array.from({ length: 14 }).map((_, index) => (
        <group key={index} position={[-10 + index * 1.55, 0, 8.4]}>
          <mesh position={[0, 0.38, 0]} castShadow><cylinderGeometry args={[0.08, 0.1, 0.76, 7]} /><meshStandardMaterial color="#5c4633" /></mesh>
          <mesh position={[0, 0.92, 0]} castShadow><sphereGeometry args={[0.48, 9, 7]} /><meshStandardMaterial color="#355c48" /></mesh>
        </group>
      ))}

      {[-9, -3, 3, 9].map((x) => (
        <group key={x} position={[x, 0, 7.25]}>
          <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.04, 0.05, 1.6, 8]} /><meshStandardMaterial color="#273839" /></mesh>
          <mesh position={[0, 1.58, 0]}><sphereGeometry args={[0.13, 10, 8]} /><meshStandardMaterial color="#fff0b3" emissive="#ffc75a" emissiveIntensity={2} /></mesh>
        </group>
      ))}

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 12]}>
        <planeGeometry args={[40, 7]} /><meshStandardMaterial color="#397d8d" roughness={0.2} metalness={0.18} />
      </mesh>
      {waterLevel > 0 && <>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.05 + waterLevel * 0.45, 7.2]}>
          <planeGeometry args={[40, 8 + effectiveProgress * 0.11]} />
          <meshStandardMaterial color="#287b98" transparent opacity={0.68} roughness={0.16} metalness={0.12} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.06 + waterLevel * 0.32, 0]}>
          <planeGeometry args={[3.1 + effectiveProgress * 0.035, 18]} />
          <meshStandardMaterial color="#3e91a9" transparent opacity={0.55} roughness={0.12} />
        </mesh>
      </>}
    </group>
  );
}
