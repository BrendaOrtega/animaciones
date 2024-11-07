import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "../lib/utils";
import React from "react";
import { useMarquee } from "../hooks/useMarquee";
import { PiRobotDuotone } from "react-icons/pi";

export const Marquee = ({
  children,
  reversed,
  className = "bg-dark ",
}: {
  className?: string;
  reversed?: boolean;
  children?: ReactNode;
}) => {
  const { x, ref } = useMarquee(reversed);

  return (
    <>
      <article className={cn("flex justify-center items-center", className)}>
        <div className="h-16 md:h-20 flex items-center text-gray-100  text-2xl lg:text-3xl font-extrabold overflow-hidden">
          <motion.div style={{ x }} className="whitespace-nowrap" ref={ref}>
            {children} {children}
          </motion.div>
        </div>
      </article>
    </>
  );
};

export const Robot = () => {
  return (
    <span
      className="animate-spin"
      style={{
        animationDuration: "5s",
      }}
    >
      <PiRobotDuotone />
    </span>
  );
};
