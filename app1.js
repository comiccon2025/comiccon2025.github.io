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
      "Этот кадр задаёт контекст: единая система связывает «Снежинку», " +
      "игровые режимы и форензик-модели. Дальше комикс раскрывает каждый модуль по отдельности."
  }
];

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

  return React.createElement(
    "section",
    { id: "scene-" + scene.id, className: "scene" },
    React.createElement(
      "div",
      { className: "scene-inner" },

      // Левая колонка: слот под картинку + плейсхолдер "3D-сцены"
      React.createElement(
        "div",
        { className: "comic-visual-column" },
        React.createElement(ComicFrameSvg, null),
        React.createElement(
          "div",
          { className: "comic-image-slot" },
          React.createElement(
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
        )
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
