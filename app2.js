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
      "аналитика и форензик-модели: наверху события, в центре данные и модели, внизу — интерфейс игрока."
  }
];

/**
 * Большой граф для блока «Схема процесса»
 * Узлы — капсулы с текстом внутри, никаких вылезающих подписей.
 */
function ProcessGraph() {
  const nodes = [
    // верхний слой: контекст
    {
      id: "igromir",
      x: 40,
      y: 30,
      w: 78,
      h: 18,
      label: "ИГРОМИР 2025",
      level: "top"
    },
    {
      id: "brand",
      x: 120,
      y: 20,
      w: 138,
      h: 20,
      label: "ЦИФРОВОЙ КРИМИНАЛИСТ",
      level: "top"
    },
    {
      id: "snejinka",
      x: 200,
      y: 30,
      w: 124,
      h: 18,
      label: "СТАНЦИЯ «СНЕЖИНКА»",
      level: "top"
    },

    // средний слой: данные
    {
      id: "audio",
      x: 40,
      y: 66,
      w: 60,
      h: 16,
      label: "АУДИО",
      level: "mid"
    },
    {
      id: "text",
      x: 118,
      y: 60,
      w: 60,
      h: 16,
      label: "ТЕКСТ",
      level: "mid"
    },
    {
      id: "meta",
      x: 196,
      y: 66,
      w: 84,
      h: 16,
      label: "МЕТАДАННЫЕ",
      level: "mid"
    },

    // средний слой 2: модели
    {
      id: "graphs",
      x: 70,
      y: 98,
      w: 96,
      h: 16,
      label: "ГРАФ СВЯЗЕЙ",
      level: "mid2"
    },
    {
      id: "spectra",
      x: 150,
      y: 98,
      w: 112,
      h: 16,
      label: "СПЕКТРОГРАММА",
      level: "mid2"
    },

    // нижний слой: интерфейс
    {
      id: "ui",
      x: 70,
      y: 128,
      w: 124,
      h: 18,
      label: "ИНТЕРФЕЙС ИГРОКА",
      level: "bottom"
    },
    {
      id: "dossier",
      x: 150,
      y: 128,
      w: 128,
      h: 18,
      label: "ДОСЬЕ / СЦЕНА 01",
      level: "bottom"
    }
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

  const nodeEls = nodes.map((n) => {
    const rx = n.h / 2; // капсула
    const ry = n.h / 2;
    const xRect = n.x - n.w / 2;
    const yRect = n.y - n.h / 2;

    return React.createElement(
      "g",
      { key: "node-" + n.id },
      React.createElement("rect", {
        x: xRect,
        y: yRect,
        width: n.w,
        height: n.h,
        rx: rx,
        ry: ry,
        className: "pg-node pg-node-" + n.level
      }),
      React.createElement(
        "text",
        {
          x: n.x,
          y: n.y + 3, // чуть ниже геометрического центра, чтобы оптика была ровной
          className: "pg-label"
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
    // фон
    React.createElement("rect", {
      x: 0,
      y: 0,
      width: 240,
      height: 150,
      className: "pg-bg"
    }),
    // лёгкая сетка
    React.createElement("path", {
      d: "M0 44 H240 M0 86 H240 M0 128 H240",
      className: "pg-grid"
    }),
    React.createElement("path", {
      d: "M40 0 V150 M120 0 V150 M200 0 V150",
      className: "pg-grid"
    }),
    edgeEls,
    nodeEls,
    // подпись панели
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
