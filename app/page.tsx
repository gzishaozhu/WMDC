"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { District } from "./components/District";
import { Weather, type WeatherMode } from "./components/Weather";

export default function Home() {
  const [selected, setSelected] = useState("滨水文化中心");
  const [weather, setWeather] = useState<WeatherMode>("clear");
  const weatherNames = { clear: "晴天", rain: "小雨", storm: "暴雨" };

  return (
    <main className="app-shell">
      <header className="masthead">
        <a className="brand" href="#scene" aria-label="涌城首页">
          <span>涌城</span>
          <small>TIDELINE</small>
        </a>
        <div className="project-meta">
          <span>WMDC 2026</span>
          <span>滨水街区韧性推演</span>
        </div>
        <button className="outline-button">项目说明</button>
      </header>

      <section className="scene" id="scene">
        <Canvas
          shadows
          camera={{ position: [20, 18, 24], fov: 38 }}
          dpr={[1, 1.6]}
        >
          <color attach="background" args={[weather === "clear" ? "#9fb8c4" : weather === "rain" ? "#607986" : "#283f4b"]} />
          <fog attach="fog" args={[weather === "clear" ? "#9fb8c4" : "#405966", weather === "storm" ? 16 : 30, weather === "storm" ? 48 : 70]} />
          <ambientLight intensity={weather === "clear" ? 1.2 : 0.55} />
          <directionalLight
            castShadow
            position={[12, 22, 8]}
            intensity={weather === "clear" ? 2.5 : 0.7}
            color="#fff2d4"
          />
          <District selected={selected} onSelect={setSelected} />
          <Weather mode={weather} />
          <OrbitControls
            makeDefault
            target={[0, 1.2, 0]}
            minDistance={16}
            maxDistance={42}
            maxPolarAngle={Math.PI / 2.08}
            enablePan={false}
          />
        </Canvas>

        <div className="hero-copy">
          <p>极端天气下的滨水街区数字孪生</p>
          <h1>让城市在暴雨到来前，<br />先经历一次未来。</h1>
        </div>

        <div className="weather-control" aria-label="天气切换">
          <p>天气系统</p>
          {(["clear", "rain", "storm"] as WeatherMode[]).map((mode) => (
            <button
              key={mode}
              className={weather === mode ? "active" : ""}
              onClick={() => setWeather(mode)}
            >
              {weatherNames[mode]}
            </button>
          ))}
        </div>

        <aside className="building-card">
          <p>当前建筑</p>
          <h2>{selected}</h2>
          <dl>
            <div><dt>空间类型</dt><dd>公共建筑</dd></div>
            <div><dt>当前状态</dt><dd className="safe">正常开放</dd></div>
            <div><dt>地下空间</dt><dd>{selected === "交通枢纽" ? "2 层" : "1 层"}</dd></div>
          </dl>
          <p className="notice">当前为功能演示数据。点击场景中的建筑可切换查看。</p>
        </aside>

        <div className="scene-help">
          <span>拖动旋转</span>
          <span>滚轮缩放</span>
          <span>点击建筑</span>
        </div>
      </section>

      <section className="intro-section">
        <p className="section-number">01</p>
        <div>
          <p className="kicker">第一阶段 / 空间底座</p>
          <h2>一座可被理解、推演<br />与重新规划的城市。</h2>
        </div>
        <p className="body-copy">
          当前版本已经建立滨水街区的三维空间骨架和建筑交互。
          后续将在同一场景中加入降雨、积水扩散、人群疏散与应急车辆调度。
        </p>
      </section>
    </main>
  );
}
