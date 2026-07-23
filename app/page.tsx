"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { District } from "./components/District";
import { Weather, type WeatherMode } from "./components/Weather";
import { SimulationActors } from "./components/SimulationActors";

export default function Home() {
  const [selected, setSelected] = useState("滨水文化中心");
  const [weather, setWeather] = useState<WeatherMode>("clear");
  const [minute, setMinute] = useState(0);
  const [layer, setLayer] = useState<"city" | "risk" | "elevation">("city");
  const [reportOpen, setReportOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mitigated, setMitigated] = useState(false);
  const weatherNames = { clear: "晴天", rain: "小雨", storm: "暴雨" };
  const effectiveMinute = mitigated ? minute * 0.58 : minute;
  const events = [
    { at: 0, title: "常态运行", detail: "建立街区空间与设备基线" },
    { at: 15, title: "暴雨预警", detail: "降雨增强，启动地下空间巡查" },
    { at: 35, title: "积水扩散", detail: "滨水道路出现通行风险" },
    { at: 50, title: "协同处置", detail: "疏散人群并调度排水车辆" },
  ];
  const jumpTo = (at: number) => {
    setMinute(at);
    setPlaying(false);
    setWeather(at === 0 ? "clear" : at < 35 ? "rain" : "storm");
  };

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setMinute((current) => {
        if (current >= 60) {
          setPlaying(false);
          return 60;
        }
        return current + 1;
      });
    }, 220);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (minute > 12) setWeather("storm");
  }, [minute]);

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
          <ambientLight intensity={weather === "clear" ? 1.2 : minute > 42 ? 0.34 : 0.55} />
          <directionalLight
            castShadow
            position={[12, 22, 8]}
            intensity={weather === "clear" ? 2.5 : 0.7}
            color="#fff2d4"
          />
          <District selected={selected} onSelect={setSelected} floodProgress={minute} layer={layer} mitigated={mitigated} />
          <Weather mode={weather} />
          <SimulationActors minute={minute} mitigated={mitigated} />
          <OrbitControls
            makeDefault
            target={[0, 1.2, 0]}
            minDistance={16}
            maxDistance={42}
            maxPolarAngle={Math.PI / 2.08}
            enablePan={false}
          />
        </Canvas>

        <div className={`hero-copy ${minute > 10 ? "compact" : ""}`}>
          <p>极端天气下的滨水街区数字孪生</p>
          <h1>让城市在暴雨到来前，<br />先经历一次未来。</h1>
        </div>

        <nav className="scenario-nav" aria-label="推演阶段">
          {events.map((event, index) => {
            const active = minute >= event.at && (index === events.length - 1 || minute < events[index + 1].at);
            return <button key={event.at} className={active ? "active" : ""} onClick={() => jumpTo(event.at)}>
              <span>0{index + 1}</span><strong>{event.title}</strong><small>{event.at} 分钟</small>
            </button>;
          })}
        </nav>

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

        <div className="layer-control" aria-label="数据图层">
          <p>数据图层</p>
          {[
            ["city", "城市材质"],
            ["risk", "风险等级"],
            ["elevation", "地形高程"],
          ].map(([value, label]) => (
            <button key={value} className={layer === value ? "active" : ""} onClick={() => setLayer(value as typeof layer)}>
              {label}
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
          <button className="report-button" onClick={() => setReportOpen(true)}>生成推演报告</button>
        </aside>

        <div className="scene-help">
          <span>拖动旋转</span>
          <span>滚轮缩放</span>
          <span>点击建筑</span>
        </div>

        <div className="timeline">
          <div className="timeline-heading">
            <span>暴雨推演时间轴</span>
            <div className="playback">
              <button onClick={() => setPlaying(!playing)}>{playing ? "暂停" : "自动播放"}</button>
              <button onClick={() => { setMinute(0); setPlaying(false); }}>重置</button>
              <strong>{minute} 分钟</strong>
            </div>
          </div>
          <input
            aria-label="推演时间"
            type="range"
            min="0"
            max="60"
            value={minute}
            onChange={(event) => {
              const next = Number(event.target.value);
              setMinute(next);
              if (next > 12 && weather !== "storm") setWeather("storm");
            }}
          />
          <div className="timeline-stats">
            <span>积水深度 <b>{effectiveMinute < 18 ? 0 : Math.round((effectiveMinute - 18) * 2.8)} mm</b></span>
            <span>受影响道路 <b>{effectiveMinute < 25 ? 0 : Math.ceil((effectiveMinute - 24) / 12)} 条</b></span>
            <span>地下入口风险 <b>{effectiveMinute < 38 ? "低" : effectiveMinute < 52 ? "中" : "高"}</b></span>
            <span>疏散状态 <b>{minute < 28 ? "待命" : minute < 58 ? "进行中" : "完成"}</b></span>
          </div>
        </div>

        <div className={`intervention ${mitigated ? "enabled" : ""}`}>
          <div>
            <p>应急干预方案</p>
            <strong>{mitigated ? "已启用" : "未启用"}</strong>
          </div>
          <button onClick={() => setMitigated(!mitigated)}>
            {mitigated ? "查看未干预结果" : "启用排水与封控"}
          </button>
          <small>启用后，模拟排水设备提前部署和地下入口封控，积水扩散系数降低 42%。</small>
        </div>

        <aside className="event-log">
          <p>事件日志</p>
          {events.filter((event) => event.at <= minute).slice(-3).reverse().map((event) => (
            <div key={event.at}><time>{String(event.at).padStart(2, "0")}:00</time><span><strong>{event.title}</strong>{event.detail}</span></div>
          ))}
          {minute === 0 && <small>拖动时间轴或选择上方阶段开始推演。</small>}
        </aside>
      </section>

      {reportOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="推演报告">
          <article className="report">
            <button className="close" onClick={() => setReportOpen(false)}>关闭</button>
            <p className="kicker">TIDELINE / 自动汇总</p>
            <h2>滨水街区暴雨推演报告</h2>
            <p className="report-date">演示报告 · 推演节点 {minute} 分钟</p>
            <div className="report-grid">
              <div><span>最大积水深度</span><strong>{effectiveMinute < 18 ? 0 : Math.round((effectiveMinute - 18) * 2.8)} mm</strong></div>
              <div><span>受影响道路</span><strong>{effectiveMinute < 25 ? 0 : Math.ceil((effectiveMinute - 24) / 12)} 条</strong></div>
              <div><span>疏散进度</span><strong>{minute < 28 ? 0 : Math.min(100, Math.round((minute - 28) / 32 * 100))}%</strong></div>
            </div>
            <h3>系统建议</h3>
            <ol>
              <li>在 30 分钟前关闭交通枢纽地下入口。</li>
              <li>排水车沿中央道路进入，避免滨水低洼路段。</li>
              <li>人群向西侧文化中心高地疏散。</li>
            </ol>
            <p className="notice">本报告由演示规则生成，不代表真实城市应急结论。</p>
          </article>
        </div>
      )}

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
