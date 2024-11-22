import { Link } from "@remix-run/react";
import React, { ReactNode, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

export const DialogButton = ({
  className,
  children,
  isDisabled,
  isLoading,
  as,
  to = "",
  onClick,
  ...props
}: {
  onClick?: () => void;
  as?: "Link";
  to?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
  [x: string]: any;
}) => {
  const Element = as === "Link" ? Link : "button";
  const [isOpen, setOpen] = useState(false);
  const ref = useRef();

  const openModal = () => {
    setOpen(true);
    // const modal = document.createElement("div");
    document.body.appendChild(ref.current);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const jsx = (
    <div
      ref={ref}
      className={cn(
        "fixed z-30  inset-0 top-0 flex items-center justify-center",
        {
          visible: isOpen,
          invisible: !isOpen,
        }
      )}
    >
      <motion.div
        initial={{ backdropFilter: "blur(0px)", opacity: 1 }}
        animate={{ backdropFilter: "blur(12px)", opacity: 1 }}
        exit={{ backdropFilter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 2 }}
        className="w-full  bg-dark/20  absolute inset-0"
      ></motion.div>
      <div className="max-w-2xl bg-white dark:bg-dark overflow-hidden  z-40 rounded-3xl">
        <div className="flex ">
          <img
            className="w-[320px] h-[480px] object-cover hidden md:block"
            src="/banner.png"
          />
          <div className="pt-10 relative">
            <button onClick={closeModal}>
              <img
                className="absolute right-4 top-4 cursor-pointer w-10"
                src="/closeDark.png"
              />
            </button>
            <h3 className="text-2xl font-medium leading-8 text-evil dark:text-white ml-10 pr-10">
              {" "}
              Únete a la lista de espera
            </h3>
            <p className="text-lg text-iron dark:text-metal font-light leading-6 mt-4 ml-10 pr-10">
              Sé de los primeros en enterarte del lanzamiento del curso, y
              recibe un descuento especial.
            </p>
            <div className="ml-5 mt-6 mr-5 dark:block hidden ">
              <iframe
                frameBorder="0"
                id="formmy-iframe"
                title="formmy"
                width="100%"
                height="260"
                src="https://formmy.app/embed/67194c1bca38562b276857c0"
                style={{ margin: "0 auto", display: "block" }}
              ></iframe>
            </div>
            <div className="ml-5 mt-6 mr-5 dark:hidden block">
              <iframe
                frameBorder="0"
                id="formmy-iframe"
                title="formmy"
                width="100%"
                height="260"
                src="https://formmy.app/embed/67194b57ca38562b276857be"
                style={{ margin: "0 auto", display: "block" }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Element
        onClick={onClick ? onClick : openModal}
        to={to}
        disabled={isDisabled}
        {...props}
        className={twMerge(
          "rounded-full enabled:hover:px-8 transition-all bg-fish text-base md:text-lg text-white h-12 md:h-14 px-6 flex gap-2 items-center justify-center font-light",
          "disabled:bg-slate-300 disabled:pointer-events-none",
          className
        )}
      >
        {!isLoading && children}
        {isLoading && (
          <div className="w-6 h-6 rounded-full animate-spin border-4 border-t-indigo-500" />
        )}
      </Element>
      {jsx}
    </>
  );
};
