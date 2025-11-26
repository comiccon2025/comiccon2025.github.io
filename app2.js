// app.js

import React, { StrictMode, Fragment } from "react";
import { createRoot } from "react-dom/client";

/**
 * Конфиг сцен (пока одна — hero)
 */
const scenes = [
  {
    id: "hero",
    label: "01",
    title: "Цифровой Криминалист — первый выпуск",
    subtitle: "Игромир 2025. Публичный дебют форензик-системы",
    description:
      "Ночной мегаполис, фасад Игромира 2025 заливают неоновые панели. " +
      "На главном экране — форензик-дашборд: граф связей, спектры и временные ряды, " +
      "отражающие работу моделей анализа речи, текста и сетевой активности. " +
      "Перед экраном — аналитик «Цифрового Криминалиста», представитель Федеральной службы бессознательного. " +
      "Она — проводник игрока в мир цифровой форензики и главный голос разъяснения всех процессов.",
    image: "https://comiccon2025.github.io/dcHero.png",
    showGraph: true,
    code: `// Титульный кадр: регистрация выпуска и героини
const issue = initIssue({
  id: 1,
  title: "Цифровой Криминалист",
  event: "Игромир 2025",
  mode: ["VR", "AR", "WEB", "Desktop"]
});

// Описываем главного аналитика и её роль
const hero = issue.registerHero({
  role: "форензик-аналитик ФСБс",
  skills: ["аудиофорензика", "стилометрия", "графовый анализ"],
  uiPanels: ["связи", "волновые формы", "метаданные"]
});

// Стартовая сцена — знакомство на стенде
issue.startScene({
  id: "expo_intro",
  location: "технологический павильон Игромира",
  focus: "публичный показ цифровой форензик-системы"
});`,
    explanation:
      "Этот кадр играет роль обложки и точки входа. Мы фиксируем три вещи: " +
      "1) Игромир 2025 как контекст; 2) появление бренда «Цифровой Криминалист»; " +
      "3) героиню-аналитика, через которую игрок/читатель будет узнавать, как устроены реальные форензик-процессы. " +
      "Мини-граф слева — стандартный элемент интерфейса: он будет появляться во всех сценах, где есть анализ связей."
  }
];

/**
 * Фирменный мини-граф для блока «Схема процесса»
 * (упрощённый вариант панели с обложки)
 */
function ProcessGraph() {
  const nodes = [
    { id: "a1", x: 12, y: 18 },
    { id: "a2", x: 35, y: 10 },
    { id: "a3", x: 60, y: 16 },
    { id: "a4", x: 82, y: 11 },
    { id: "a5", x: 104, y: 20 },

    { id: "b1", x: 18, y: 36 },
    { id: "b2", x: 40, y: 30 },
    { id: "b3", x: 63, y: 34 },
    { id: "b4", x: 86, y: 30 },
    { id: "b5", x: 108, y: 38 },

    { id: "c1", x: 24, y: 54 },
    { id: "c2", x: 46, y: 48 },
    { id: "c3", x: 70, y: 52 },
    { id: "c4", x: 94, y: 46 }
  ];

  const edges = [
    ["a1", "a2"],
    ["a2", "a3"],
    ["a3", "a4"],
    ["a4", "a5"],

    ["a1", "b1"],
    ["a2", "b2"],
    ["a3", "b3"],
    ["a4", "b4"],
    ["a5", "b5"],

    ["b1", "b2"],
    ["b2", "b3"],
    ["b3", "b4"],
    ["b4", "b5"],

    ["b1", "c1"],
    ["b2", "c2"],
    ["b3", "c3"],
    ["b4", "c4"],

    ["c1", "c2"],
    ["c2", "c3"],
    ["c3", "c4"]
  ];

  const nodeById = {};
  nodes.forEach((n) => {
    nodeById[n.id] = n;
  });

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
      className: "process-graph-edge"
    });
  });

  const nodeEls = nodes.map((n) =>
    React.createElement("circle", {
      key: "node-" + n.id,
      cx: n.x,
      cy: n.y,
      r: 2.4,
      className: "process-graph-node"
    })
  );

  return React.createElement(
    "svg",
    {
      className: "process-graph",
      viewBox: "0 0 120 70",
      preserveAspectRatio: "xMidYMid meet"
    },
    // лёгкий фон-панель
    React.createElement("rect", {
      x: 0,
      y: 0,
      width: 120,
      height: 70,
      className: "process-graph-bg"
    }),
    // горизонтальные псевдо-сетки
    React.createElement("path", {
      d: "M0 23 H120 M0 46 H120",
      className: "process-graph-grid"
    }),
    edgeEls,
    nodeEls
  );
}

/**
 * SVG-рамка панели
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
    }),
    React.createElement("path", {
      d: "M8 10 Q 14 7 22 9",
      fill: "none",
      stroke: "rgba(248,250,252,0.4)",
      strokeWidth: "0.6"
    }),
    React.createElement("path", {
      d: "M78 50 Q 86 53 92 49",
      fill: "none",
      stroke: "rgba(56,189,248,0.5)",
      strokeWidth: "0.6"
    })
  );
}

/**
 * Один кадр комикса
 */
function Scene(props) {
  const scene = props.scene;

  // Контент кода + пояснение
  const codeContent = React.createElement(
    Fragment,
    null,
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

  let codeBlockChildren;
  if (scene.showGraph) {
    // Вариант с мини-графом слева
    codeBlockChildren = React.createElement(
      "div",
      { className: "code-block-inner" },
      React.createElement(ProcessGraph, null),
      React.createElement("div", { className: "process-code" }, codeContent)
    );
  } else {
    // Чисто текстовый вариант
    codeBlockChildren = codeContent;
  }

  return React.createElement(
    "section",
    { id: "scene-" + scene.id, className: "scene" },
    React.createElement(
      "div",
      { className: "scene-inner" },

      // Левая колонка: изображение
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
                "Здесь будет основное комикс-изображение и 3D-сцена для кадра «",
                scene.title,
                "».",
                React.createElement("br", null),
                "Сейчас — прототип без 3D."
              )
        )
      ),

      // Правая колонка: текст + код
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
        React.createElement("div", { className: "code-block" }, codeBlockChildren)
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
    scenes.map(function (scene) {
      return React.createElement("a", {
        key: scene.id,
        href: "#scene-" + scene.id,
        title: scene.title,
        "aria-label": scene.title
      });
    })
  );
}

function App() {
  return React.createElement(
    Fragment,
    null,
    scenes.map(function (scene) {
      return React.createElement(Scene, { key: scene.id, scene: scene });
    })
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

// Монтируем навигацию (справа точки)
const navElement = document.querySelector(".scene-nav");
if (navElement) {
  const navRoot = createRoot(navElement);
  navRoot.render(
    React.createElement(
      StrictMode,
      null,
      React.createElement(SceneNav, { scenes: scenes })
    )
  );
}
