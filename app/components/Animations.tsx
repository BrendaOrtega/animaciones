import React from "react";
import { twMerge } from "tailwind-merge";
import { ScrollReveal } from "~/home/Hero";
export const Animations = () => {
  return (
    <ScrollReveal>
      <section className="my-[80px] lg:my-[120px]">
        <h2 className="text-dark dark:text-white text-3xl md:text-4xl lg:text-5xl	text-evil font-bold text-center">
          ¿Qué componentes vamos a construir? 🎨
        </h2>
        <p className="text-iron dark:text-metal font-light text-lg md:text-xl lg:text-2xl  text-center mt-4">
          A lo largo de 12 unidades y más de 20 lecciones, construirás
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-16 mt-12 md:mt-20">
          <Card
            title="Flip words"
            className="bg-flipWords hover:bg-flipWordsGif"
          />
          <Card
            title="Swipe Gallery"
            className="bg-draggable hover:bg-draggableGif"
          />
          <Card title="3D card" className="bg-cards hover:bg-cardsGif" />
          <Card
            title="Hero highlight"
            className="bg-highlight hover:bg-highlightGif"
          />
          <Card title="Basic Scroll" className="bg-scroll hover:bg-scrollGif" />
          <Card title="3d animations" className="bg-image hover:bg-imageGif" />
          <Card title="Grid Modal" className="bg-zoom hover:bg-zoomGif" />
          <Card title="Link preview" className="bg-link hover:bg-linkGif" />
          <Card
            title="Moving border"
            className="bg-border hover:bg-borderGif"
          />
          <Card
            title="Images slider"
            className="bg-slider hover:bg-sliderGif"
          />
          <Card title="Draggable list" className="bg-list hover:bg-listGif" />
          <Card
            title="Infinite moving items"
            className="bg-infinite hover:bg-infiniteGif"
          />
        </div>
      </section>
    </ScrollReveal>
  );
};

const Card = ({
  title,
  image,
  className,
}: {
  image?: string;
  title: string;
  className?: string;
}) => {
  return (
    <section className="col-span-1 group">
      <div
        className={twMerge(
          "bg-cover bg-center w-full h-[240px] md:h-[280px] rounded-lg transition-all cursor-pointer dark:border dark:border-lightGray/10",
          className
        )}
      ></div>
      <h3 className="font-semibold text-dark dark:text-white  mt-3 text-2xl group-hover:translate-x-6 transition-all">
        {title}
      </h3>
    </section>
  );
};
