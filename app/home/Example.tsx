import React from "react";
import { HeroHighlight, Highlight } from "../components/highlight";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";

export function Example() {
  return (
    <HeroHighlight className="bg-dark min-h-screen w-full flex items-center justify-center">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        Crea tus propios componentes animados usando
        <br />
        <Highlight className="text-white dark:text-white">
          React y Framer Motion
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}
