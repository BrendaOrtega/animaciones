import React from "react";
import { ScrollReveal } from "./Hero";

export const Why = () => {
  return (
    <ScrollReveal>
      {" "}
      <section className="	flex flex-wrap-reverse xl:flex-nowrap gap-[64px] pt-[120px] pb-[80px] lg:pt-[160px] lg:pb-[120px]">
        <img
          className="h-[240px] w-full xl:w-[42%] object-cover rounded-xl md:h-[320px] xl:h-auto"
          src="https://images.pexels.com/photos/7437487/pexels-photo-7437487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />

        <div className="w-full lg:w-[58%]">
          <h2 className="dark:text-white  text-3xl md:text-4xl lg:text-5xl	text-dark font-bold">
            Porqué tomar este curso 🎯
          </h2>
          <p className="text-lg  dark:text-metal text-iron font-light mt-6">
            Aprenderás de forma teórica y práctica a crear componentes de React
            animados con motion. Y como es característico de cada uno de
            nuestros cursos, no estarás solo en este proceso, aprenderás los
            fundamentos de motion, además de una repasadita de los fundamentos
            de React para después empezar a construir animaciones declarativas y
            automáticas, sencillas y complejas, vistosas y sutiles para
            aplicarlas a tus componentes, aprenderás a definir animaciones con
            scroll o con el mouse, y mucho más.
          </p>
          <p className="text-lg  dark:text-metal text-iron font-light mt-4">
            Después del curso, tus sitios web no volverán a ser los mismos.
            Podrás agregar animaciones que le den un toque dinámico y
            diferenciador.
          </p>
          <div className="flex flex-wrap md:flex-nowrap gap-12 mt-12">
            <div className="w-full md:w-[50%] ">
              <h3 className="text-2xl text-wvil text-dark dark:text-white font-semibold">
                Únete a la comunidad 👨‍👩‍👦‍👦
              </h3>
              <p className="  dark:text-metal text-iron font-light mt-2">
                Al ser parte del curso, también eres parte de la comunidad de
                Discord, en donde puedes conversar con otros estudiantes o con
                el instructor para{" "}
                <span className="text-iron dark:text-white/70 font-semibold">
                  {" "}
                  colaborar, pedir feedback o recibir ayuda.
                </span>{" "}
              </p>
            </div>
            <div className="w-full md:w-[50%]">
              <h3 className="text-2xl text-wvil text-dark dark:text-white font-semibold">
                Aprende de forma flexible ⌛️{" "}
              </h3>
              <p className="  dark:text-metal text-iron font-light mt-2">
                No es necesario un horario fijo para tomar el curso, hazlo{" "}
                <span className="text-iron dark:text-white/70 font-semibold">
                  cuando quieras desde donde quieras.
                </span>{" "}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-12 mt-12">
            <div className="w-full md:w-[50%] ">
              <h3 className="text-2xl text-wvil text-dark dark:text-white font-semibold">
                Más y más componentes 🔥
              </h3>
              <p className="  dark:text-metal text-iron font-light mt-2">
                Seguiremos agregado componentes durante el año, así que después
                de que lo termines{" "}
                <span className="text-iron dark:text-white/70 font-semibold">
                  regresa de vez en cuando a ver que hay de nuevo.
                </span>
              </p>
            </div>
            <div className="w-full md:w-[50%]">
              <h3 className="text-2xl text-wvil text-dark dark:text-white font-semibold">
                Con acceso permanente 🛟
              </h3>
              <p className="  dark:text-metal text-iron font-light mt-2">
                Al comprar el curso tienes{" "}
                <span className="text-iron dark:text-white/70 font-semibold">
                  acceso de por vida
                </span>{" "}
                desde tu cuenta, además de acceso a todas las futuras
                actualizaciones.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};
