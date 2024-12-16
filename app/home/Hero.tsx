import React, { ReactNode } from "react";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextGenerateEffect } from "../components/text-generate-effect";
import { motion } from "framer-motion";
import { Tools } from "./Tools";

const words = `  Aprende animaciones web con React`;

export const Hero = ({ children }: { children?: ReactNode }) => {
  return (
    <section className="bg-magic flex flex-wrap md:flex-nowrap  bg-contain bg-no-repeat bg-right pt-12 md:pt-[120px] min-h-[90vh] lg:min-h-[95vh]  ">
      <div className="w-full px-6 pt-0 md:px-0 lg:max-w-7xl mx-auto flex flex-col items-center justify-center ">
        <Tools />
        <div className="w-full lg:w-[70%] mx-auto -mt-8 md:mt-12 ">
          <TextGenerateEffect words={words} />
          <p className="text-iron dark:text-metal text-center text-lg lg:text-2xl font-light dark:font-extralight mt-3 mb-12">
            construyendo más de 14 componentes con Motion
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
  return (
    <motion.div
      whileInView={{
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
      }}
      initial={{
        y: 100,
        opacity: 0,
        filter: "blur(4px)",
      }}
    >
      {children}
    </motion.div>
  );
};
