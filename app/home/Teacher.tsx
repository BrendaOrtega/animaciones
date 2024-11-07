import React from "react";
import { ScrollReveal } from "./Hero";
import { FloatingDock } from "../components/floating-dock";
import { FaLinkedin, FaSquareXTwitter, FaYoutube } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

export const Teacher = () => {
  return (
    <ScrollReveal>
      <section className="flex overflow-hidden flex-wrap lg:flex-nowrap bg-[#FAFAFF] dark:bg-transparent dark:border dark:border-white/10 px-6  md:pr-0 md:pl-12 gap-12 justify-between rounded-[40px] my-10 md:my-20 lg:my-[120px]">
        <div className="w-full lg:w-[45%] pt-8 pb-6 md:py-12">
          <span className="text-dark dark:text-metal font-light dark:font-extralight  text-xl">
            ¿Quien será tu instructor? 🧑🏻‍🏫
          </span>
          <h2 className="font-semibold text-2xl md:text-5xl dark:text-white mb-2 mt-6 text-dark">
            Héctor Bliss
          </h2>
          <span className="dark:text-metal/80 dark:font-extralight font-light text-iron">
            Software Engineer & Lead Teacher
          </span>
          <p className="mt-12 text-iron dark:text-metal dark:font-extralight font-light ">
            Con más de 10 años de experiencia como desarrollador de software
            profesional e instructor tecnológico, Héctor Bliss disfruta de
            simplificar temas complejos para que sus estudiantes puedan{" "}
            <strong className="text-gray-800 dark:text-white/60 font-medium">
              {" "}
              aprender de la forma más práctica, rápida y divertida.
            </strong>{" "}
            Héctor ha sido instructor en diferentes bootcamps internacionales, y
            ha grabado infinidad de cursos en línea. Por medio de su canal de
            youtube{" "}
            <strong className="text-gray-800 dark:text-white/60  font-medium">
              enseña los temas más actualizados de la industria tecnológica,
            </strong>{" "}
            acercando las herramientas que usan los profesionales nivel mundial
            a sus estudiantes de habla hispana.{" "}
          </p>
          <p className="mt-6 text-iron dark:text-metal dark:font-extralight font-light ">
            {" "}
            Si no has experimentado una clase con Héctor Bliss,{" "}
            <strong className="text-gray-800 dark:text-white/60 font-medium ">
              es tu momento de comprobar que aprender no tiene que ser ni
              díficil ni aburrido.
            </strong>
          </p>
          <FloatingMedia />
        </div>
        <img
          className="hidden lg:block dark:hidden w-full rounded-full md:rounded-none  lg:w-[50%] md:object-contain bg-left"
          src="/titor.png"
        />
        <img
          className="w-full lg:w-[50%] object-cover object-left hidden dark:hidden dark:lg:block "
          src="/titor-w.png"
        />
      </section>
    </ScrollReveal>
  );
};

const media = [
  {
    title: "@Héctorbliss",
    icon: <FaLinkedin className="text-3xl text-dark dark:text-metal" />,
    href: "https://www.linkedin.com/in/hectorbliss/",
  },

  {
    title: "@blissito",
    icon: <FaGithub className="text-3xl text-dark dark:text-metal" />,
    href: "https://github.com/blissito",
  },
  {
    title: "@blissito",
    icon: <FaYoutube className="text-3xl text-dark dark:text-metal" />,
    href: "https://www.youtube.com/@blissito",
  },
  {
    title: "@HéctorBliss",
    icon: <FaSquareXTwitter className="text-3xl text-dark dark:text-metal" />,
    href: "https://twitter.com/HectorBlisS",
  },
];

const FloatingMedia = () => {
  return (
    <div className="mt-12">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={media}
      />
    </div>
  );
};
