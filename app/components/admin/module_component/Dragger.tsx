import { motion } from "motion/react";
import { PointerEvent } from "react";
import { GrDrag } from "react-icons/gr";

// Este es un handler reusable ::

export const Dragger = ({
  onPointerDown,
}: {
  onPointerDown: (arg0: PointerEvent<HTMLButtonElement>) => any;
}) => {
  return (
    <motion.button
      whileTap={{ cursor: "grabbing", boxShadow: "0px 0px 24px 0px gray" }}
      className="cursor-grab py-px pr-px shadow-[unset] text-xl text-gray-900"
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown?.(e);
      }}
    >
      <GrDrag />
    </motion.button>
  );
};
