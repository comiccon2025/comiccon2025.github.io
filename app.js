// Подключаем React, ReactDOM, three.js и react-three-fiber через jsDelivr (ESM)
import React, { StrictMode, useRef } from "https://cdn.jsdelivr.net/npm/react@18.3.1/+esm";
import { createRoot } from "https://cdn.jsdelivr.net/npm/react-dom@18.3.1/client/+esm";
import {
  Canvas,
  useFrame
} from "https://cdn.jsdelivr.net/npm/@react-three/fiber@9.4.0/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/+esm";

/**
 * Мини-3D-сцена: вращающийся куб поверх «арктического» градиента.
 * Это просто живой фон, дальше заменим на графы, станции и т.п.
 */
function RotatingCube() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.45;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial
        color={"#38bdf8"}
        metalness={0.6}
        roughness={0.25}
        emissive={"#0f172a"}
      />
    </mesh>
  );
}

function SimpleThreeBackground() {
  return (
    <Canvas
      className="scene-canvas"
      camera={{ position: [0, 0, 4.2], fov: 45 }}
    >
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[2, 2, 3]}
        intensity={1.5}
        color={"#38bdf8"}
      />
      <pointLight position={[-3, -2, -5]} intensity={0.5} color={"#f97316"} />
      <RotatingCube />
    </Canvas>
  );
}

/**
 * Конфиг сцен. Пока только одна — hero.
 * Дальше будем добавлять по одной сцене и расширять этот массив.
 */
const scenes = [
  {
    id: "hero",
    label: "01",
    title: "Игромир & Comic Con 2025",
    subtitle: "Интерактивный комикс о цифровой форензике в Арктике",
    description:
      "Вы попадаете на международную станцию «Снежинка» и в систему «Цифровой Криминалист». " +
      "В игре соединяются VR, AR, WEB и десктоп-режимы. Этот пригласительный комикс показывает все ключевые сцены и механики.",
    code: `// Инициализация арктического форензик-контура
const app = initForensicPipeline({
  station: "Снежинка",
  creators: ["команда Atomic Heart"],
  modes: ["VR", "AR", "WEB", "Desktop"],
  modules: ["Техника", "Биотех", "Форензика", "Учебный режим"]
});

// Дальше в комиксе мы пройдёмся по каждому модулю:
app.showStoryboard();`,
    explanation:
      "Этот кадр задаёт контекст: единая система связывает арктическую станцию «Снежинка», " +
      "игровые режимы и форензик-модели. Всё остальное — раскадровка этих модулей."
  }
];

/**
 * SVG-рамка для слота комикс-изображения
 */
function ComicFrameSvg() {
  return (
    <svg
      className="comic-frame-svg"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
    >
      <rect
        x="2"
        y="2"
        width="96"
        height="56"
        rx="4"
        ry="4"
        fill="none"
        stroke="rgba(148,163,184,0.7)"
        strokeWidth="1.2"
        strokeDasharray="1.5 2.5"
      />
      <path
        d="M8 10 Q 14 7 22 9"
        fill="none"
        stroke="rgba(248,250,252,0.4)"
        strokeWidth="0.6"
      />
      <path
        d="M78 50 Q 86 53 92 49"
        fill="none"
        stroke="rgba(56,189,248,0.5)"
        strokeWidth="0.6"
      />
    </svg>
  );
}

/**
 * Один кадр комикса
 */
function Scene({ scene }) {
  return (
    <section id={`scene-${scene.id}`} className="scene">
      <div className="scene-inner">
        {/* Левая колонка: 3D-фон + слот под изображение комикса */}
        <div className="comic-visual-column">
          <ComicFrameSvg />
          <div className="comic-image-slot">
            {/* сюда позже подставим <img src="..."> с готовым кадром */}
            <span>
              Здесь будет основное комикс-изображение для сцены «{scene.title}».
              <br />
              Сейчас — прототип с 3D-фоном.
            </span>
          </div>
          <SimpleThreeBackground />
        </div>

        {/* Правая колонка: текст + код */}
        <div className="comic-text-column">
          <div className="scene-label">СЦЕНА {scene.label}</div>
          <h2 className="scene-title">{scene.title}</h2>
          {scene.subtitle && (
            <div className="scene-subtitle">{scene.subtitle}</div>
          )}
          {scene.description && (
            <p className="scene-description">{scene.description}</p>
          )}

          <div className="code-block">
            <pre>
              <code>{scene.code}</code>
            </pre>
            {scene.explanation && (
              <p className="code-explanation">{scene.explanation}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Навигация-точки по сценам (якоря)
 */
function SceneNav({ scenes }) {
  return (
    <>
      {scenes.map((scene) => (
        <a
          key={scene.id}
          href={`#scene-${scene.id}`}
          title={scene.title}
          aria-label={scene.title}
        ></a>
      ))}
    </>
  );
}

function App() {
  return (
    <>
      {scenes.map((scene) => (
        <Scene key={scene.id} scene={scene} />
      ))}
    </>
  );
}

// Монтируем React-приложение
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Заполняем навигацию точками (простая несвязная с React часть)
const nav = document.querySelector(".scene-nav");
if (nav) {
  const navRoot = createRoot(nav);
  navRoot.render(
    <StrictMode>
      <SceneNav scenes={scenes} />
    </StrictMode>
  );
}
