import { useMotionValue, useSpring, motion } from "framer-motion";
import { MouseEvent } from "react";

export const SimpleDragger = () => {
  const x = useMotionValue(0);
  const springX = useSpring(x);

  const handleMouse = (event: MouseEvent) => {
    x.set(event.pageX - 100);
  };

  const handleLeave = () => {
    x.set(0);
  };

  return (
    <section
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="h-screen bg-gray-900 w-full flex flex-col justify-center items-start overflow-hidden"
    >
      <motion.div
        style={{
          x: springX,
          position: "relative",
        }}
        className="bg-indigo-500 rounded-full w-40 h-40"
      />
    </section>
  );
};
