// app.js

import React, {
  StrictMode,
  Fragment,
  useState,
  useEffect
} from "react";
import { createRoot } from "react-dom/client";

/**
 * Конфиг сцен
 */
const scenes = [
  {
    id: "hero",
    label: "01",
    title: "Цифровой Криминалист — первый выпуск",
    subtitle: "Игромир 2025. Публичный дебют форензик-системы",
    description:
      "Ночной мегаполис и неоновый фасад Игромира 2025. " +
      "На огромной панели — граф связей, спектры и временные ряды, " +
      "которые показывают работу моделей анализа речи, текста и сетевой активности. " +
      "Рядом — аналитик «Цифрового Криминалиста», представитель Федеральной службы бессознательного.",
    image: "https://comiccon2025.github.io/dcHero.png",
    dominantGraph: true,
    code: "",
    explanation:
      "Граф в блоке «Схема процесса» показывает, как выпуск 01 связывает Игромир 2025, " +
      "аналитика и форензик-модели: наверху события, в центре данные и модели, внизу — интерфейс игрока. " +
      "Под обложкой слева расположен спектральный блок с полосами амплитуд, который будет повторяться во всех сценах с аудиоанализом."
  }
];

/**
 * Генерация раскладки для эквалайзер-квадратиков по сетке 32×32
 */
function createEqLayout() {
  if (typeof window === "undefined") return [];

  const cell = 32; // размер клетки, как у фоновой сетки
  const cols = Math.floor(window.innerWidth / cell);
  const rows = Math.floor(window.innerHeight / cell);

  const items = [];
  let id = 0;

  for (let col = 0; col < cols; col++) {
    // не каждая колонка — эквалайзер
    if (Math.random() > 0.45) continue;

    const stackHeight = 3 + Math.floor(Math.random() * 5); // 3–7 клеток
    const minBaseRow = Math.floor(rows * 0.4);
    const maxBaseRow = rows - 2;
    let baseRow = Math.floor(Math.random() * rows);
    if (baseRow < minBaseRow) baseRow = minBaseRow;
    if (baseRow > maxBaseRow) baseRow = maxBaseRow;

    for (let k = 0; k < stackHeight; k++) {
      const row = baseRow - k;
      if (row < 0) break;

      const size = 10; // размер квадратика
      const offset = (cell - size) / 2;

      const top = row * cell + offset;
      const left = col * cell + offset;

      const variant = (col + k) % 3; // раскраска
      const delay = (col * 0.25 + k * 0.08) % 5; // каскад
      const duration = 2.5 + Math.random() * 1.5; // 2.5–4 сек

      items.push({
        id: id++,
        top,
        left,
        variant,
        delay,
        duration
      });
    }
  }

  return items;
}

/**
 * Слой мигающих квадратиков-эквалайзеров на фоне
 */
function GridPulses() {
  const [cells, setCells] = useState(() => createEqLayout());

  useEffect(() => {
    function handleResize() {
      setCells(createEqLayout());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const spans = cells.map((c) => {
    const cls =
      "grid-pulse " +
      (c.variant === 0
        ? "grid-pulse-orange"
        : c.variant === 1
        ? "grid-pulse-cyan"
        : "grid-pulse-blue");

    const style = {
      top: c.top + "px",
      left: c.left + "px",
      animationDelay: c.delay + "s",
      animationDuration: c.duration + "s"
    };

    return (
      <span key={c.id} className={cls} style={style} />
    );
  });

  return <div className="grid-pulses">{spans}</div>;
}

/**
 * Большой граф для блока «Схема процесса»
 * Узлы — компактные капсулы, размер которых привязан к длине текста.
 */
function ProcessGraph() {
  const nodes = [
    // верхний слой: контекст
    { id: "igromir", x: 40, y: 26, label: "ИГРОМИР 2025", level: "top" },
    { id: "brand", x: 120, y: 18, label: "ЦИФРОВОЙ КРИМИНАЛИСТ", level: "top" },
    { id: "snejinka", x: 200, y: 26, label: "СТАНЦИЯ «СНЕЖИНКА»", level: "top" },

    // средний слой: данные
    { id: "audio", x: 40, y: 60, label: "АУДИО", level: "mid" },
    { id: "text", x: 118, y: 54, label: "ТЕКСТ", level: "mid" },
    { id: "meta", x: 196, y: 60, label: "МЕТАДАННЫЕ", level: "mid" },

    // средний слой 2: модели
    { id: "graphs", x: 70, y: 90, label: "ГРАФ СВЯЗЕЙ", level: "mid2" },
    { id: "spectra", x: 150, y: 90, label: "СПЕКТРОГРАММА", level: "mid2" },

    // нижний слой: интерфейс
    { id: "ui", x: 70, y: 122, label: "ИНТЕРФЕЙС ИГРОКА", level: "bottom" },
    { id: "dossier", x: 150, y: 122, label: "ДОСЬЕ / СЦЕНА 01", level: "bottom" }
  ];

  const edges = [
    // верх → данные
    ["igromir", "audio"],
    ["igromir", "text"],
    ["brand", "audio"],
    ["brand", "text"],
    ["brand", "meta"],
    ["snejinka", "meta"],

    // данные → модели
    ["audio", "graphs"],
    ["text", "graphs"],
    ["text", "spectra"],
    ["meta", "graphs"],
    ["meta", "spectra"],

    // модели → интерфейс
    ["graphs", "ui"],
    ["spectra", "dossier"],
    ["graphs", "dossier"],
    ["ui", "dossier"]
  ];

  const nodeById = {};
  nodes.forEach((n) => (nodeById[n.id] = n));

  const edgeEls = edges.map(([from, to], idx) => {
    const a = nodeById[from];
    const b = nodeById[to];
    if (!a || !b) return null;
    return (
      <line
        key={"edge-" + idx}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        className="pg-edge"
      />
    );
  });

  const fontSize = 6;
  const paddingX = 4;
  const paddingY = 2;
  const charWidth = 3.1;

  const nodeEls = nodes.map((n) => {
    const textLen = n.label.length;
    const w = textLen * charWidth + paddingX * 2;
    const h = fontSize + paddingY * 2;

    const xRect = n.x - w / 2;
    const yRect = n.y - h / 2;
    const rx = h / 2;
    const ry = h / 2;

    return (
      <g key={"node-" + n.id}>
        <rect
          x={xRect}
          y={yRect}
          width={w}
          height={h}
          rx={rx}
          ry={ry}
          className={"pg-node pg-node-" + n.level}
        />
        <text
          x={n.x}
          y={n.y + 2}
          className={"pg-label pg-label-" + n.level}
        >
          {n.label}
        </text>
      </g>
    );
  });

  return (
    <svg
      className="process-graph"
      viewBox="0 0 240 150"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="0"
        y="0"
        width="240"
        height="150"
        className="pg-bg"
      />
      <path
        d="M0 40 H240 M0 82 H240 M0 124 H240"
        className="pg-grid"
      />
      <path
        d="M40 0 V150 M120 0 V150 M200 0 V150"
        className="pg-grid"
      />
      {edgeEls}
      {nodeEls}
      <text x="120" y="146" className="pg-caption">
        ВЫПУСК 01 · КАРТА СВЯЗЕЙ
      </text>
    </svg>
  );
}

/**
 * Мини-панель спектрального анализа — только тонкие полосы
 */
function SpectralPanel() {
  const barHeights = [
    10, 18, 12, 22, 16, 20, 14, 24, 18, 12, 26, 16,
    14, 22, 10, 20, 18, 24, 16, 12, 22, 18, 14, 26,
    16, 20, 12, 24, 18, 14, 22, 16, 10, 20, 18, 24
  ];

  const barEls = barHeights.map((h, i) => {
    const baseY = 70;
    const x = 4 + i * 6;
    const w = 2.5;
    const y = baseY - h;

    return (
      <g key={"bar-" + i}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          className="sp-bar"
        />
        <rect
          x={x}
          y={y - 1.2}
          width={w}
          height={1.2}
          className="sp-bar-cap"
        />
      </g>
    );
  });

  return (
    <svg
      className="spectral-panel"
      viewBox="0 0 240 80"
      preserveAspectRatio="xMidYMid meet"
    >
      {barEls}
    </svg>
  );
}

/**
 * Рамка комикс-панели слева
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
    </svg>
  );
}

/**
 * Один кадр комикса
 */
function Scene({ scene }) {
  const codeBlock = scene.dominantGraph ? (
    <div className="code-block code-block-graph">
      <ProcessGraph />
      {scene.explanation && (
        <p className="code-explanation code-explanation-graph">
          {scene.explanation}
        </p>
      )}
    </div>
  ) : (
    <div className="code-block">
      <pre>
        <code>{scene.code}</code>
      </pre>
      {scene.explanation && (
        <p className="code-explanation">{scene.explanation}</p>
      )}
    </div>
  );

  return (
    <section id={"scene-" + scene.id} className="scene">
      <div className="scene-inner">
        {/* Левая колонка: комикс + спектр */}
        <div className="comic-visual-column">
          <ComicFrameSvg />
          <div className="comic-image-slot">
            {scene.image ? (
              <img
                src={scene.image}
                alt={scene.title}
                className="comic-image"
              />
            ) : (
              <span>
                Здесь будет основное комикс-изображение для сцены «
                {scene.title}
                ».
              </span>
            )}
          </div>
          <SpectralPanel />
        </div>

        {/* Правая колонка: текст + схема процесса */}
        <div className="comic-text-column">
          <div className="scene-label">СЦЕНА {scene.label}</div>
          <h2 className="scene-title">{scene.title}</h2>
          {scene.subtitle && (
            <div className="scene-subtitle">{scene.subtitle}</div>
          )}
          {scene.description && (
            <p className="scene-description">
              {scene.description}
            </p>
          )}
          {codeBlock}
        </div>
      </div>
    </section>
  );
}

/**
 * Навигация-точки справа
 */
function SceneNav({ scenes }) {
  return (
    <Fragment>
      {scenes.map((scene) => (
        <a
          key={scene.id}
          href={"#scene-" + scene.id}
          title={scene.title}
          aria-label={scene.title}
        />
      ))}
    </Fragment>
  );
}

function App() {
  return (
    <Fragment>
      <GridPulses />
      {scenes.map((scene) => (
        <Scene key={scene.id} scene={scene} />
      ))}
    </Fragment>
  );
}

// Монтируем основное приложение
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Монтируем навигацию-точки
const navElement = document.querySelector(".scene-nav");
if (navElement) {
  const navRoot = createRoot(navElement);
  navRoot.render(
    <StrictMode>
      <SceneNav scenes={scenes} />
    </StrictMode>
  );
}
