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
  // Узлы графа: сущности выпуска 01
  const nodes = [
    { id: "issue", x: 70, y: 18, label: "ISSUE", type: "core" },
    { id: "hero", x: 32, y: 38, label: "HERO", type: "entity" },
    { id: "event", x: 108, y: 38, label: "EVENT", type: "entity" },

    { id: "audio", x: 25, y: 58, label: "AUDIO", type: "model" },
    { id: "style", x: 70, y: 58, label: "STYLE", type: "model" },
    { id: "graph", x: 115, y: 58, label: "GRAPH", type: "model" },

    { id: "ui", x: 40, y: 78, label: "UI", type: "entity" },
    { id: "scene", x: 100, y: 78, label: "SCENE", type: "entity" }
  ];

  // Рёбра: как объекты связаны между собой
  const edges = [
    ["issue", "hero"],
    ["issue", "event"],
    ["issue", "style"],

    ["hero", "audio"],
    ["hero", "style"],
    ["hero", "graph"],

    ["audio", "ui"],
    ["style", "ui"],
    ["graph", "scene"],
    ["style", "scene"],
    ["event", "scene"]
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
    React.createElement(
      "g",
      { key: "node-" + n.id },
      React.createElement("circle", {
        cx: n.x,
        cy: n.y,
        r: n.type === "core" ? 3.2 : 2.5,
        className:
          "process-graph-node process-graph-node-" + n.type
      }),
      React.createElement(
        "text",
        {
          x: n.x,
          y: n.y - (n.type === "core" ? 5.5 : 4.5),
          className: "process-graph-label"
        },
        n.label
      )
    )
  );

  return React.createElement(
    "svg",
    {
      className: "process-graph",
      viewBox: "0 0 140 90",
      preserveAspectRatio: "xMidYMid meet"
    },
    // Общий фон панели
    React.createElement("rect", {
      x: 0,
      y: 0,
      width: 140,
      height: 90,
      className: "process-graph-bg"
    }),
    // Подсветка слоя моделей
    React.createElement("rect", {
      x: 8,
      y: 48,
      width: 124,
      height: 18,
      className: "process-graph-band-models"
    }),
    // Подсветка слоя сцены/UI
    React.createElement("rect", {
      x: 16,
      y: 68,
      width: 108,
      height: 16,
      className: "process-graph-band-scenes"
    }),
    // Горизонтальные "нитки" как на доске расследования
    React.createElement("path", {
      d: "M0 32 H140 M0 52 H140 M0 72 H140",
      className: "process-graph-grid"
    }),
    edgeEls,
    nodeEls,
    // Подпись снизу
    React.createElement(
      "text",
      {
        x: 70,
        y: 86,
        className: "process-graph-caption"
      },
      "Выпуск 01 · связи"
    )
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
