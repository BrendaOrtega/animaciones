import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { cn } from "~/lib/utils";

export const Drawer = ({
  children,
  isOpen = false,
  onClose,
  title = "Título",
  subtitle,
  cta,
  className,
  header,
  mode,
}: {
  mode?: "big";
  header?: ReactNode;
  cta?: ReactNode;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  isOpen?: boolean;
  children: ReactNode;
  className?: string;
}) => {
  const body = useRef<HTMLElement>();

  // listeners
  const handleKeys = (event: unknown) => {
    if (event.key === "Escape") {
      onClose?.();
    }
  };

  useEffect(() => {
    if (document.body) {
      body.current = document.body;
    }
    // listers
    addEventListener("keydown", handleKeys);

    // block scroll
    if (document.body && isOpen) {
      document.body.style.overflow = "hidden";
    } else if (document.body && !isOpen) {
      document.body.style.overflow = "";
    }
    // clean up
    return () => {
      removeEventListener("keydown", handleKeys);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const jsx = (
    <article className={cn("relative ", className)}>
      <motion.button
        onClick={onClose}
        id="overlay"
        className="fixed inset-0 bg-dark/60  z-10"
        animate={{ backdropFilter: "blur(4px)" }}
        exit={{ backdropFilter: "blur(0)", opacity: 0 }}
      />
      <motion.section
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "120%" }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        className={cn(
          "bg-dark border border-white/10 z-10 h-screen fixed top-0 right-0 shadow-xl rounded-tl-3xl rounded-bl-3xl py-8 px-4 flex flex-col lg:w-[40%] md:w-[60%] w-[95%]",
          {
            "md:w-[95%] w-[95%]": mode === "big",
          }
        )}
      >
        <header className="flex items-start justify-end mb-6 ">
          {header ? (
            header
          ) : (
            <div>
              <h4 className="text-2xl font-semibold md:text-4xl text-white">
                {title}
              </h4>
              <p className="text-brand_gray">{subtitle}</p>
            </div>
          )}
          <Link
            to="/player"
            tabIndex={0}
            onClick={onClose}
            className=" ml-10 w-10 h-10 flex items-center justify-center bg-gray-200/10 rounded-full p-1 active:scale-95"
          >
            <IoClose className="text-white text-2xl" />
          </Link>
        </header>

        <section className="overflow-y-scroll h-[95%]">{children}</section>
        <nav className="flex justify-end gap-4  mt-auto">
          {cta ? (
            cta
          ) : (
            <>
              <button
                onClick={onClose}
                className="bg-brand_blue text-white hover:scale-95 rounded-full px-8 py-2 transition-all"
              >
                Aceptar
              </button>
              <button
                onClick={onClose}
                className="text-red-500 bg-transparent px-8 py-2 hover:scale-95 transition-all"
              >
                Cancelar
              </button>
            </>
          )}
        </nav>
      </motion.section>
    </article>
  );

  /* <>{body.current && createPortal(jsx, body.current)}</> */
  return <AnimatePresence mode="popLayout">{isOpen && jsx}</AnimatePresence>;
};
