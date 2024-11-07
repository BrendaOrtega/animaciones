import React from "react";
import { Marquee } from "../components/Banners";

export const ScrollBanner = () => {
  return (
    <>
      <Marquee className="jolly-lodger-regular bg-dark">
        No más sitios web estáticos <span className="mx-3">🪄</span> Agrega
        animaciones a tu sitio web
        <span className="mx-3">🧙🏻</span> Personaliza tus animaciones
        <span className="mx-3">🎃</span> Crea tus propios componentes
        <span className="mx-3">🎛️</span>
        No más sitios web estáticos <span className="mx-3">🪄</span> Agrega
        animaciones a tu sitio web
        <span className="mx-3">🧙🏻</span> Personaliza tus animaciones
        <span className="mx-3">🤩</span> Crea tus propios componentes
        <span className="mx-3">🎛️</span>
      </Marquee>
      <Marquee reversed className="bg-fish jolly-lodger-regular">
        Scroll Animations<span className="mx-3">🎐</span> Parallax
        <span className="mx-3">💻</span> Efectos 3d{" "}
        <span className="mx-3">🎯</span> Drawers<span className="mx-3">👀</span>{" "}
        Galerías<span className="mx-3">🏞️</span> Dynamic cards{" "}
        <span className="mx-3">🚀</span>Text effects{" "}
        <span className="mx-3">💬</span> Modals <span className="mx-3">🔥</span>
        Scroll Animations<span className="mx-3">🎐</span> Parallax
        <span className="mx-3">💻</span> Efectos 3d{" "}
        <span className="mx-3">🎯</span> Drawers<span className="mx-3">👀</span>{" "}
        Galerías<span className="mx-3">🏞️</span> Dynamic cards{" "}
        <span className="mx-3">🚀</span>Text effects{" "}
        <span className="mx-3">💬</span> Modals <span className="mx-3">🔥</span>
      </Marquee>
    </>
  );
};
