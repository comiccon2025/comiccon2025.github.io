// app.js

const { useState, useEffect, Fragment, StrictMode } = React;
const { createRoot } = ReactDOM;

// --------------------------------------
// Конфиг сцен
// --------------------------------------
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

const e = React.createElement;

// --------------------------------------
// Генерация раскладки для эквалайзеров
// --------------------------------------
function createEqLayout() {
  if (typeof window === "undefined") return [];

  const cell = 32; // шаг сетки бэкграунда
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

      const size = 10;
      const offset = (cell - size) / 2;

      const top = row * cell + offset;
      const left = col * cell + offset;

      const variant = (col + k) % 3;
      const delay = (col * 0.25 + k * 0.08) % 5;
      const duration = 2.5 + Math.random() * 1.5;

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

// --------------------------------------
// Слой мигающих квадратиков-эквалайзеров
// --------------------------------------
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

    return e("span", {
      key: c.id,
      className: cls,
      style
    });
  });

  return e("div", { className: "grid-pulses" }, spans);
}

// --------------------------------------
// Большой граф «Схема процесса»
// --------------------------------------
function ProcessGraph() {
  const nodes = [
    { id: "igromir", x: 40, y: 26, label: "ИГРОМИР 2025", level: "top" },
    { id: "brand", x: 120, y: 18, label: "ЦИФРОВОЙ КРИМИНАЛИСТ", level: "top" },
    { id: "snejinka", x: 200, y: 26, label: "СТАНЦИЯ «СНЕЖИНКА»", level: "top" },

    { id: "audio", x: 40, y: 60, label: "АУДИО", level: "mid" },
    { id: "text", x: 118, y: 54, label: "ТЕКСТ", level: "mid" },
    { id: "meta", x: 196, y: 60, label: "МЕТАДАННЫЕ", level: "mid" },

    { id: "graphs", x: 70, y: 90, label: "ГРАФ СВЯЗЕЙ", level: "mid2" },
    { id: "spectra", x: 150, y: 90, label: "СПЕКТРОГРАММА", level: "mid2" },

    { id: "ui", x: 70, y: 122, label: "ИНТЕРФЕЙС ИГРОКА", level: "bottom" },
    { id: "dossier", x: 150, y: 122, label: "ДОСЬЕ / СЦЕНА 01", level: "bottom" }
  ];

  const edges = [
    ["igromir", "audio"],
    ["igromir", "text"],
    ["brand", "audio"],
    ["brand", "text"],
    ["brand", "meta"],
    ["snejinka", "meta"],

    ["audio", "graphs"],
    ["text", "graphs"],
    ["text", "spectra"],
    ["meta", "graphs"],
    ["meta", "spectra"],

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
    return e("line", {
      key: "edge-" + idx,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      className: "pg-edge"
    });
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

    return e(
      "g",
      { key: "node-" + n.id },
      e("rect", {
        x: xRect,
        y: yRect,
        width: w,
        height: h,
        rx,
        ry,
        className: "pg-node pg-node-" + n.level
      }),
      e(
        "text",
        {
          x: n.x,
          y: n.y + 2,
          className: "pg-label pg-label-" + n.level
        },
        n.label
      )
    );
  });

  return e(
    "svg",
    {
      className: "process-graph",
      viewBox: "0 0 240 150",
      preserveAspectRatio: "xMidYMid meet"
    },
    e("rect", {
      x: 0,
      y: 0,
      width: 240,
      height: 150,
      className: "pg-bg"
    }),
    e("path", {
      d: "M0 40 H240 M0 82 H240 M0 124 H240",
      className: "pg-grid"
    }),
    e("path", {
      d: "M40 0 V150 M120 0 V150 M200 0 V150",
      className: "pg-grid"
    }),
    edgeEls,
    nodeEls,
    e(
      "text",
      { x: 120, y: 146, className: "pg-caption" },
      "ВЫПУСК 01 · КАРТА СВЯЗЕЙ"
    )
  );
}

// --------------------------------------
// Мини-панель спектрального анализа
// --------------------------------------
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

    return e(
      "g",
      { key: "bar-" + i },
      e("rect", {
        x,
        y,
        width: w,
        height: h,
        className: "sp-bar"
      }),
      e("rect", {
        x,
        y: y - 1.2,
        width: w,
        height: 1.2,
        className: "sp-bar-cap"
      })
    );
  });

  return e(
    "svg",
    {
      className: "spectral-panel",
      viewBox: "0 0 240 80",
      preserveAspectRatio: "xMidYMid meet"
    },
    barEls
  );
}

// --------------------------------------
// SVG-рамка панельки комикса
// --------------------------------------
function ComicFrameSvg() {
  return e(
    "svg",
    {
      className: "comic-frame-svg",
      viewBox: "0 0 100 60",
      preserveAspectRatio: "none"
    },
    e("rect", {
      x: 2,
      y: 2,
      width: 96,
      height: 56,
      rx: 4,
      ry: 4,
      fill: "none",
      stroke: "rgba(148,163,184,0.7)",
      strokeWidth: 1.2,
      strokeDasharray: "1.5 2.5"
    })
  );
}

// --------------------------------------
// Одна сцена-кадр комикса
// --------------------------------------
function Scene(props) {
  const scene = props.scene;

  const codeBlock = scene.dominantGraph
    ? e(
        "div",
        { className: "code-block code-block-graph" },
        e(ProcessGraph, null),
        scene.explanation
          ? e(
              "p",
              { className: "code-explanation code-explanation-graph" },
              scene.explanation
            )
          : null
      )
    : e(
        "div",
        { className: "code-block" },
        e(
          "pre",
          null,
          e("code", null, scene.code)
        ),
        scene.explanation
          ? e("p", { className: "code-explanation" }, scene.explanation)
          : null
      );

  return e(
    "section",
    { id: "scene-" + scene.id, className: "scene" },
    e(
      "div",
      { className: "scene-inner" },

      // Левая колонка: комикс + спектр
      e(
        "div",
        { className: "comic-visual-column" },
        e(ComicFrameSvg, null),
        e(
          "div",
          { className: "comic-image-slot" },
          scene.image
            ? e("img", {
                src: scene.image,
                alt: scene.title,
                className: "comic-image"
              })
            : e(
                "span",
                null,
                "Здесь будет основное комикс-изображение для сцены «",
                scene.title,
                "»."
              )
        ),
        e(SpectralPanel, null)
      ),

      // Правая колонка: текст + граф
      e(
        "div",
        { className: "comic-text-column" },
        e(
          "div",
          { className: "scene-label" },
          "СЦЕНА ",
          scene.label
        ),
        e("h2", { className: "scene-title" }, scene.title),
        scene.subtitle
          ? e("div", { className: "scene-subtitle" }, scene.subtitle)
          : null,
        scene.description
          ? e("p", { className: "scene-description" }, scene.description)
          : null,
        codeBlock
      )
    )
  );
}

// --------------------------------------
// Навигация-точки справа
// --------------------------------------
function SceneNav(props) {
  const scenesLocal = props.scenes;
  return e(
    Fragment,
    null,
    scenesLocal.map((scene) =>
      e("a", {
        key: scene.id,
        href: "#scene-" + scene.id,
        title: scene.title,
        "aria-label": scene.title
      })
    )
  );
}

// --------------------------------------
// Корневой компонент
// --------------------------------------
function App() {
  return e(
    Fragment,
    null,
    e(GridPulses, null),
    scenes.map((scene) => e(Scene, { key: scene.id, scene }))
  );
}

// --------------------------------------
// Монтирование
// --------------------------------------
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(e(StrictMode, null, e(App, null)));

// Навигация-точки
const navElement = document.querySelector(".scene-nav");
if (navElement) {
  const navRoot = createRoot(navElement);
  navRoot.render(
    e(StrictMode, null, e(SceneNav, { scenes }))
  );
}
