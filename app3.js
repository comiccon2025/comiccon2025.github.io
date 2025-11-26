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
    code: "",
    explanation:
      "Граф в блоке «Схема процесса» показывает, как выпуск 01 связывает Игромир 2025, " +
      "аналитика и форензик-модели: наверху события, в центре данные и модели, внизу — интерфейс игрока. " +
      "Под обложкой слева расположен спектральный блок с полосами амплитуд, который будет повторяться во всех сценах с аудиоанализом."
  }
];

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
    return React.createElement("line", {
      key: "edge-" + idx,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      className: "pg-edge"
    });
  });

  // Шрифт 6px, немного воздуха по краям
  const fontSize = 6;
  const paddingX = 4;
  const paddingY = 2;
  const charWidth = 3.1; // подобрано под капсульные надписи

  const nodeEls = nodes.map((n) => {
    const textLen = n.label.length;
    const w = textLen * charWidth + paddingX * 2;
    const h = fontSize + paddingY * 2;

    const xRect = n.x - w / 2;
    const yRect = n.y - h / 2;
    const rx = h / 2;
    const ry = h / 2;

    return React.createElement(
      "g",
      { key: "node-" + n.id },
      React.createElement("rect", {
        x: xRect,
        y: yRect,
        width: w,
        height: h,
        rx: rx,
        ry: ry,
        className: "pg-node pg-node-" + n.level
      }),
      React.createElement(
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

  return React.createElement(
    "svg",
    {
      className: "process-graph",
      viewBox: "0 0 240 150",
      preserveAspectRatio: "xMidYMid meet"
    },
    React.createElement("rect", {
      x: 0,
      y: 0,
      width: 240,
      height: 150,
      className: "pg-bg"
    }),
    React.createElement("path", {
      d: "M0 40 H240 M0 82 H240 M0 124 H240",
      className: "pg-grid"
    }),
    React.createElement("path", {
      d: "M40 0 V150 M120 0 V150 M200 0 V150",
      className: "pg-grid"
    }),
    edgeEls,
    nodeEls,
    React.createElement(
      "text",
      {
        x: 120,
        y: 146,
        className: "pg-caption"
      },
      "ВЫПУСК 01 · КАРТА СВЯЗЕЙ"
    )
  );
}

/**
 * Мини-панель спектрального анализа — только тонкие полосы, без сетки и волны.
 */
function SpectralPanel() {
  // Больше и тоньше полос: шаг по X меньше, ширина 2.5
  const barHeights = [
    10, 18, 12, 22, 16, 20, 14, 24, 18, 12, 26, 16,
    14, 22, 10, 20, 18, 24, 16, 12, 22, 18, 14, 26,
    16, 20, 12, 24, 18, 14, 22, 16, 10, 20, 18, 24
  ];

  const barEls = barHeights.map((h, i) => {
    const baseY = 70;
    const x = 4 + i * 6; // чаще по X
    const w = 2.5;       // тоньше
    const y = baseY - h;

    return React.createElement(
      "g",
      { key: "bar-" + i },
      React.createElement("rect", {
        x,
        y,
        width: w,
        height: h,
        className: "sp-bar"
      }),
      React.createElement("rect", {
        x,
        y: y - 1.2,
        width: w,
        height: 1.2,
        className: "sp-bar-cap"
      })
    );
  });

  return React.createElement(
    "svg",
    {
      className: "spectral-panel",
      viewBox: "0 0 240 80",
      preserveAspectRatio: "xMidYMid meet"
    },
    // Фона и сетки нет — панель прозрачная, только полосы
    barEls
  );
}

/**
 * Рамка комикс-панели слева
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
    ? React.createElement(
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
    : React.createElement(
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

      // Левая колонка: комикс-картинка + спектральная панель
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
        ),
        React.createElement(SpectralPanel, null)
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
 * Навигация-точки справа
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

// Монтируем основное приложение
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  React.createElement(
    StrictMode,
    null,
    React.createElement(App, null)
  )
);

// Монтируем навигацию-точки
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
