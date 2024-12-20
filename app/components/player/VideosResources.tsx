import { Video } from "@prisma/client";
import { Link } from "@remix-run/react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";
import { GrGithub } from "react-icons/gr";
import { IoMdLock } from "react-icons/io";
import { IoDocumentsOutline } from "react-icons/io5";
import { HiOutlineDocumentSearch } from "react-icons/hi";

import {
  MdMenuOpen,
  MdOutlineAutoAwesomeMotion,
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";
import { useClickOutside } from "~/hooks/useClickOutside";
import { cn } from "~/lib/utils";
import { FaReact } from "react-icons/fa";

export const VideosResources = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (arg0: any) => void;
}) => {
  // const [isOpen, setIsOpen] = useState(defaultOpen);
  const x = useMotionValue(0);
  const springX = useSpring(x, { bounce: 0.2 });
  const buttonX = useTransform(springX, [-400, 0], [0, 394]);

  useEffect(() => {
    isOpen ? x.set(0) : x.set(-400);
  }, [isOpen, x]);

  return (
    <div className="bg-[#141518] h-full ">
      <MenuButton
        x={buttonX}
        onToggle={() => setIsOpen((o) => !o)}
        isOpen={isOpen}
      />
      <MenuListContainer
        isOpen={isOpen}
        x={springX}
        onOutsideClick={() => setIsOpen(false)}
      >
        {/* Esto empuja la lista */}
        <div className="px-6 bg-[#141518] py-10 rounded-r-3xl">
          <h3 className="text-white text-2xl font-bold">
            Esta es la lista de recursos o links que ocuparás durante el curso:
          </h3>
          <ul className="text-metal mt-12 flex flex-col gap-3">
            <a
              href="https://github.com/FixterGeek/Animaciones.git"
              target="_blank"
            >
              <li className="flex gap-3 items-center hover:text-fish">
                <GrGithub /> Link al repo
              </li>
            </a>

            <a href="https://motion.dev/" target="_blank">
              <li className="flex gap-3 items-center hover:text-fish">
                <MdOutlineAutoAwesomeMotion /> Documentación oficial de Motion
              </li>
            </a>
            <a href="https://react.dev/://motion.dev/" target="_blank">
              <li className="flex gap-3 items-center hover:text-fish">
                <FaReact /> Documentación oficial de React
              </li>
            </a>
          </ul>
          <p className="text-metal mt-12">
            Recuerda que los componentes{" "}
            <span className="text-white/80 font-semibold">
              son tuyos, puedes empezar a usarlos desde ahora en tus proyectos.
            </span>
          </p>
        </div>
        <div className="h-40" />
      </MenuListContainer>
    </div>
  );
};

const MenuListContainer = ({
  children,
  x = 0,
  onOutsideClick,
  isOpen: isActive = false,
}: {
  isOpen?: boolean;
  children: ReactNode;
  x?: MotionValue | number;
  onOutsideClick?: () => void;
}) => {
  const ref = useClickOutside({ isActive, onOutsideClick });
  const maskImage = useMotionTemplate`linear-gradient(to bottom, white 80%, transparent 100%`;
  return (
    <motion.div
      ref={ref}
      style={{
        x,
        scrollbarWidth: "none",
        maskImage,
      }}
      className="md:w-[380px] w-[300px] fixed  rounded-xl overflow-y-scroll h-[88%] bg-[#141518] top-0 left-0 pt-20 z-20"
    >
      {children}
    </motion.div>
  );
};

const MenuButton = ({
  isOpen,
  x = 0,
  onToggle,
}: {
  x?: MotionValue | number;
  onToggle?: () => void;
  isOpen?: boolean;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      style={{ x }}
      onClick={onToggle}
      className={cn(
        "fixed bg-[#141518] text-4xl w-14 h-14 text-white top-0 mt-36 p-2 z-20 flex items-center justify-center rounded-r-2xl hover:bg-[rgba(35,35,44)]",
        {
          "left-[-80px] md:left-auto": isOpen,
          "rounded-2xl": isOpen,
        }
      )}
    >
      <AnimatePresence mode="popLayout">
        {isOpen ? (
          <motion.span
            key="open"
            initial={{ filter: "blur(9px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(9px)", opacity: 0 }}
          >
            <HiOutlineDocumentSearch />
          </motion.span>
        ) : (
          <motion.span
            initial={{ filter: "blur(9px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(9px)", opacity: 0 }}
            key="close"
          >
            <IoDocumentsOutline className="text-3xl " />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
