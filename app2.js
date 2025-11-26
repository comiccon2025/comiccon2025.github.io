// app.js

import React, { StrictMode, Fragment } from "react";
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
    code: "", // в титульной сцене код не показываем
    explanation:
      "Граф в блоке «Схема процесса» показывает, как выпуск 01 связывает Игромир 2025, " +
      "аналитика и форензик-модели: наверху события, в центре данные и модели, внизу — интерфейс игрока."
  }
];

/**
 * Большой «детективный» граф для блока «Схема процесса»
 * (слой событий → слой данных/моделей → слой интерфейса)
 */
function ProcessGraph() {
  const nodes = [
    // верхний слой: контекст
    { id: "igromir", x: 40, y: 24, label: "ИГРОМИР 2025", level: "top" },
    { id: "brand", x: 120, y: 18, label: "ЦИФРОВОЙ КРИМИНАЛИСТ", level: "top" },
    { id: "snejinka", x: 200, y: 24, label: "СТАНЦИЯ «СНЕЖИНКА»", level: "top" },

    // средний слой: данные и модели
    { id: "audio", x: 40, y: 62, label: "АУДИО", level: "mid" },
    { id: "text", x: 118, y: 56, label: "ТЕКСТ", level: "mid" },
    { id: "meta", x: 196, y: 62, label: "МЕТАДАННЫЕ", level: "mid" },

    { id: "graphs", x: 70, y: 88, label: "ГРАФ СВЯЗЕЙ", level: "mid2" },
    { id: "spectra", x: 150, y: 88, label: "СПЕКТРОГРАММА", level: "mid2" },

    // нижний слой: то, что видит человек
    { id: "ui", x: 70, y: 120, label: "ИНТЕРФЕЙС ИГРОКА", level: "bottom" },
    { id: "dossier", x: 150, y: 120, label: "ДОСЬЕ / СЦЕНА 01", level: "bottom" }
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
    return React.createElement("line", {
      key: "edge-" + idx,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      className: "pg-edge"
    });
  });

  const nodeEls = nodes.map((n) =>
    React.createElement(
      "g",
      { key: "node-" + n.id },
      React.createElement("circle", {
        cx: n.x,
        cy: n.y,
        r: n.level === "top" ? 4 : 3,
        className: "pg-node pg-node-" + n.level
      }),
      React.createElement(
        "text",
        {
          x: n.x,
          y: n.y - (n.level === "top" ? 7 : 6),
          className: "pg-label"
        },
        n.label
      )
    )
  );

  // две «волны» как на титульной панели
  const waveTop =
    "M 16 100 C 40 90 60 110 84 100 S 132 90 164 100 S 204 110 228 100";
  const waveBottom =
    "M 16 110 C 40 120 60 100 84 110 S 132 120 164 110 S 204 100 228 110";

  return React.createElement(
    "svg",
    {
      className: "process-graph",
      viewBox: "0 0 240 140",
      preserveAspectRatio: "xMidYMid meet"
    },
    // фон
    React.createElement("rect", {
      x: 0,
      y: 0,
      width: 240,
      height: 140,
      className: "pg-bg"
    }),
    // сетка
    React.createElement("path", {
      d: "M0 40 H240 M0 80 H240 M0 120 H240",
      className: "pg-grid"
    }),
    React.createElement("path", {
      d: "M40 0 V140 M120 0 V140 M200 0 V140",
      className: "pg-grid"
    }),
    // полупрозрачные полосы слоёв
    React.createElement("rect", {
      x: 6,
      y: 12,
      width: 228,
      height: 26,
      className: "pg-band pg-band-top"
    }),
    React.createElement("rect", {
      x: 6,
      y: 50,
      width: 228,
      height: 32,
      className: "pg-band pg-band-mid"
    }),
    React.createElement("rect", {
      x: 6,
      y: 116,
      width: 228,
      height: 18,
      className: "pg-band pg-band-bottom"
    }),
    // рёбра и узлы
    edgeEls,
    nodeEls,
    // волны
    React.createElement("path", {
      d: waveTop,
      className: "pg-wave pg-wave-top"
    }),
    React.createElement("path", {
      d: waveBottom,
      className: "pg-wave pg-wave-bottom"
    }),
    // подпись панели
    React.createElement(
      "text",
      {
        x: 120,
        y: 136,
        className: "pg-caption"
      },
      "ВЫПУСК 01 · КАРТА СВЯЗЕЙ"
    )
  );
}

/**
 * Рамка комикс-панели
 */
function ComicFrameSvg() {
  return React.createElement(
    "svg",
    {
      className: "comic-frame-svg",
      viewBox: "0 0 100 60",
      preserveAspectRatio: "none"
    },
    React.createElement("rect", {
      x: "2",
      y: "2",
      width: "96",
      height: "56",
      rx: "4",
      ry: "4",
      fill: "none",
      stroke: "rgba(148,163,184,0.7)",
      strokeWidth: "1.2",
      strokeDasharray: "1.5 2.5"
    })
  );
}

/**
 * Один кадр комикса
 */
function Scene(props) {
  const scene = props.scene;

  const codeBlock = scene.dominantGraph
    ? // режим: граф во весь блок
      React.createElement(
        "div",
        { className: "code-block code-block-graph" },
        React.createElement(ProcessGraph, null),
        scene.explanation
          ? React.createElement(
              "p",
              { className: "code-explanation code-explanation-graph" },
              scene.explanation
            )
          : null
      )
    : // стандартный режим: код + короткое объяснение
      React.createElement(
        "div",
        { className: "code-block" },
        React.createElement(
          "pre",
          null,
          React.createElement("code", null, scene.code)
        ),
        scene.explanation
          ? React.createElement(
              "p",
              { className: "code-explanation" },
              scene.explanation
            )
          : null
      );

  return React.createElement(
    "section",
    { id: "scene-" + scene.id, className: "scene" },
    React.createElement(
      "div",
      { className: "scene-inner" },

      // Левая колонка: комикс-картинка
      React.createElement(
        "div",
        { className: "comic-visual-column" },
        React.createElement(ComicFrameSvg, null),
        React.createElement(
          "div",
          { className: "comic-image-slot" },
          scene.image
            ? React.createElement("img", {
                src: scene.image,
                alt: scene.title,
                className: "comic-image"
              })
            : React.createElement(
                "span",
                null,
                "Здесь будет основное комикс-изображение для сцены «",
                scene.title,
                "»."
              )
        )
      ),

      // Правая колонка: текст + «Схема процесса»
      React.createElement(
        "div",
        { className: "comic-text-column" },
        React.createElement(
          "div",
          { className: "scene-label" },
          "СЦЕНА ",
          scene.label
        ),
        React.createElement(
          "h2",
          { className: "scene-title" },
          scene.title
        ),
        scene.subtitle
          ? React.createElement(
              "div",
              { className: "scene-subtitle" },
              scene.subtitle
            )
          : null,
        scene.description
          ? React.createElement(
              "p",
              { className: "scene-description" },
              scene.description
            )
          : null,
        codeBlock
      )
    )
  );
}

/**
 * Навигация-точки
 */
function SceneNav(props) {
  const scenes = props.scenes;
  return React.createElement(
    Fragment,
    null,
    scenes.map((scene) =>
      React.createElement("a", {
        key: scene.id,
        href: "#scene-" + scene.id,
        title: scene.title,
        "aria-label": scene.title
      })
    )
  );
}

function App() {
  return React.createElement(
    Fragment,
    null,
    scenes.map((scene) =>
      React.createElement(Scene, { key: scene.id, scene })
    )
  );
}

// Монтируем
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  React.createElement(
    StrictMode,
    null,
    React.createElement(App, null)
  )
);

const navElement = document.querySelector(".scene-nav");
if (navElement) {
  const navRoot = createRoot(navElement);
  navRoot.render(
    React.createElement(
      StrictMode,
      null,
      React.createElement(SceneNav, { scenes })
    )
  );
}
