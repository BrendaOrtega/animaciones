import { useEffect, useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function SegundoEjemplo() {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setShow(true), 2000);
  };

  return (
    <article className="h-screen flex items-center justify-center bg-pink-400 ">
      <AnimatePresence>
        {show && (
          <motion.div
            className="relative"
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 1, type: "spring" }}
          >
            <h1 className="text-8xl text-gray-800">Hola blissmo</h1>
            <button
              onClick={handleClose}
              className="text-6xl hover:scale-105 transition-all active:scale-100"
              style={{
                position: "absolute",
                top: -16,
                right: -16,
                rotate: "-4deg",
              }}
            >
              <FaWindowClose />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function PrimerEjemplo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      animateEnter();
    }, 300);
  }, []);

  const animateExit = (secs: number = 1) => {
    if (!ref.current) return;
    ref.current.style.animationDuration = `${secs * 1000}`;
    ref.current.style.transform = "translateY(-20px)";
    ref.current.style.opacity = "0";
    ref.current.style.filter = "blur(9px)";
  };

  const animateEnter = (secs: number = 1) => {
    if (!ref.current) return;
    ref.current.style.animationDuration = `${secs * 1000}`;
    ref.current.style.transform = "translateY(0px)";
    ref.current.style.opacity = "1";
    ref.current.style.filter = "blur(0px)";
  };

  const handleClose = () => {
    if (!ref.current) return; // guard

    animateExit();
    setTimeout(animateEnter, 3000); // reset
  };

  return (
    <article className="h-screen flex items-center justify-center bg-pink-400 ">
      <div
        style={{
          transform: "translateY(20px)",
          opacity: "0",
          filter: "blur(9px)",
          animationDelay: "1",
          transition: "all 1s",
          transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
        className="relative"
        ref={ref}
      >
        <h1 className="text-8xl text-gray-800">Hola blissmo</h1>
        <button
          onClick={handleClose}
          className="text-6xl hover:scale-105 transition-all active:scale-100"
          style={{
            position: "absolute",
            top: -16,
            right: -16,
            rotate: "4deg",
          }}
        >
          <FaWindowClose />
        </button>
      </div>
    </article>
  );
}
