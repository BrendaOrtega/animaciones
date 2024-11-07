import React, { ReactNode, useRef } from "react";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextGenerateEffect } from "../components/text-generate-effect";
import { motion, useInView } from "framer-motion";
import { Tools } from "./Tools";
const words = `  Aprende animaciones web con React`;

export const Hero = ({ children }: { children?: ReactNode }) => {
  return (
    <section className=" flex flex-wrap md:flex-nowrap  bg-contain bg-no-repeat bg-center pt-12 md:pt-[120px] min-h-[90vh] lg:min-h-[95vh]  ">
      <div className="w-full px-6 pt-0 md:px-0 lg:max-w-7xl mx-auto flex flex-col items-center ">
        <Tools />
        <div className="w-full lg:w-[70%] mx-auto -mt-8 md:mt-12 ">
          <TextGenerateEffect words={words} />
          <p className="text-iron dark:text-metal text-center text-lg lg:text-2xl font-light dark:font-extralight mt-3 mb-12">
            Construye 12 componentes animados para tus proyectos web
          </p>
          {children ? (
            children
          ) : (
            <PrimaryButton className="w-full md:w-auto mx-auto">
              Comprar <img src="/cursor.svg" />
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  );
};

export const ScrollReveal = ({ children }: { children: ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      style={{
        opacity: isInView ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
        transform: isInView ? "translateY(0)" : "translateY(100px)",
      }}
      ref={ref}
    >
      {children}
    </motion.div>
  );
};
