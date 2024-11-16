import { motion } from "motion/react";
import { useState } from "react";

export default function Route() {
  const [rotate, setRotate] = useState(0);

  return (
    <article className="h-screen flex justify-center items-center bg-gray-200">
      <section className="flex flex-col gap-6">
        <label className="flex flex-col items-center gap-6 mb-8">
          <span className="text-2xl">Rotación: {rotate}degs</span>
          <input
            defaultValue="180"
            min="0"
            max="180"
            type="checkbox"
            onChange={(e) => setRotate(e.target.checked ? 200 : 0)}
          />
        </label>
        <motion.div
          initial={{ opacity: 0, x: 100, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)", rotate }}
          transition={{ type: "spring" }}
          className="h-40 aspect-square bg-pink-500 rounded-xl"
        />
      </section>
    </article>
  );
}
