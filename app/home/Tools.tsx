import React from "react";
import { FloatingDock } from "../components/floating-dock";
import { Flipper } from "../components/Flipper";
import { TbBrandFramerMotion } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { FaJsSquare, FaCss3Alt } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";

export const Tools = () => {
  return (
    <section className="">
      <Flipper>
        <div className="bg-[#F4BC7F] w-full h-full flex items-center justify-center">
          {/* <FaCss3Alt className="text-[160px] text-dark" /> */}
          <img className="w-[50%]" src="/css2.svg" />
        </div>
        <div className="bg-[#F7DF1E] w-full h-full flex items-center justify-center">
          {/* <FaJsSquare className="text-[160px] text-dark" /> */}
          <img className="w-[50%]" src="/js2.svg" />
        </div>
        <div className="bg-[#9CD2E1] w-full h-full flex items-center justify-center">
          <FaReact className="text-[160px] text-[#1C6C82]" />
        </div>
        <div className="bg-[#C7CEDB] w-full h-full flex items-center justify-center">
          {/* <TbBrandFramerMotion className="text-[160px] text-dark" /> */}
          <img className="w-[50%]" src="/framer.svg" />
        </div>
        <div className="bg-[#D2E1E2] w-full h-full flex items-center justify-center">
          <RiTailwindCssFill className="text-[160px] text-[#00ACC1]" />
        </div>
      </Flipper>
    </section>
  );
};
