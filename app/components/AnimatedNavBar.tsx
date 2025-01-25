import { cn } from "~/lib/utils";
import { ReactNode, useState } from "react";
import {
  FaArrowRight,
  FaChevronDown,
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { BiLogoTypescript, BiLogoPython } from "react-icons/bi";
import { FaGolang } from "react-icons/fa6";
import { DiRubyRough } from "react-icons/di";
import { RiPhpFill } from "react-icons/ri";
import { FaPizzaSlice } from "react-icons/fa";
import { AiFillApi } from "react-icons/ai";
import { SiRaycast } from "react-icons/si";
import { FaProductHunt } from "react-icons/fa";
import { IoLogoFreebsdDevil } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import { FaHeart } from "react-icons/fa";
import { motion } from "motion/react";
import { FaTwitter } from "react-icons/fa";

const BG_COLOR = "bg-[#1717170D]";
// const BG_COLOR_0 = "bg-[#faefe5]";

export const AnimatedNavBar = () => {
  const [currentHover, setCurrentHover] = useState("producto");
  return (
    <nav
      onMouseLeave={() => setCurrentHover("")}
      className={cn(
        "relative", // for panel to hook
        "px-4 mx-auto max-w-5xl flex justify-around items-center h-14 bg-white"
      )}
    >
      <Logo />
      <Menu
        onHover={(name: string) => setCurrentHover(name)}
        currentHover={currentHover}
      />
      <SignInButtons />
      <Panel
        currentHover={currentHover}
        direction={currentHover === "producto" ? -1 : 1}
      >
        {currentHover === "producto" ? (
          <ProductLayout />
        ) : currentHover === "recursos" ? (
          <ResourcesLayout />
        ) : currentHover === "empresa" ? (
          <CompanyLayout />
        ) : null}
      </Panel>
    </nav>
  );
};

const Panel = ({
  direction = 1,
  children,
  currentHover,
}: {
  currentHover?: string;
  direction?: number;
  children: ReactNode;
}) => {
  return currentHover === "" ? null : (
    <motion.section
      transition={{ type: "spring", bounce: 0 }}
      initial={{
        width: "550px",
        height: 300,
        x: direction * 10,
        filter: "blur(1px)",
      }}
      animate={{ width: "auto", height: "auto", x: 0, filter: "blur(0px)" }}
      key={currentHover}
      className={cn(
        "max-w-2xl",
        "rounded-3xl",
        "overflow-hidden",
        "absolute border bg-white h-max shadow top-14"
      )}
    >
      {children}
    </motion.section>
  );
};

const Menu = ({
  currentHover,
  onHover,
}: {
  currentHover: string;
  onHover?: (name: string) => void;
}) => {
  return (
    <section className="flex">
      <Button
        mode={currentHover === "" || (currentHover === "producto" && "solid")}
        onMouseEnter={() => onHover?.("producto")}
        chevron
      >
        Producto
      </Button>
      <Button
        mode={currentHover === "recursos" && "solid"}
        onMouseEnter={() => onHover?.("recursos")}
        chevron
      >
        Recursos
      </Button>
      <Button
        mode={currentHover === "empresa" && "solid"}
        onMouseEnter={() => onHover?.("empresa")}
        chevron
      >
        Empresa
      </Button>
      <Button onMouseEnter={() => onHover?.("")}>Industria</Button>
      <Button>Precios</Button>
    </section>
  );
};

const SignInButtons = () => {
  return (
    <form className="flex gap-1">
      <Button mode="shadow">Log in</Button>
      <Button mode="primary">Sign up</Button>
    </form>
  );
};

const Button = ({
  children,
  className,
  mode = "ghost",
  chevron,
  onMouseEnter,
  onMouseLeave,
}: {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  chevron?: boolean;
  mode?: "ghost" | "solid" | "shadow" | "primary";
  className?: string;
  children: ReactNode;
}) => {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "py-1 px-3",
        "group",
        "hover:bg-[#1717170D]",
        "text-xs font-medium",
        "flex items-center gap-1",
        "rounded-lg transition-all",
        {
          "bg-transparent": mode === "ghost",
          "bg-[#1717170D]": mode === "solid",
          "border shadow-xs": mode === "shadow",
          "border bg-black text-white": mode === "primary",
          "hover:bg-black hover:ring-2 ring-black": mode === "primary",
        },
        className
      )}
    >
      <span>{children}</span>
      {chevron && (
        <span className="text-[7px] group-hover:rotate-180 transition-all">
          <FaChevronDown />
        </span>
      )}
    </button>
  );
};

const Logo = () => {
  return (
    <svg
      className="max-w-[54px] max-h-[40px]"
      width="65"
      height="64"
      viewBox="0 0 65 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.5 64C50.1731 64 64.5 49.6731 64.5 32C64.5 20.1555 58.0648 9.81393 48.5 4.28099V31.9999V47.9998H40.5V45.8594C38.1466 47.2207 35.4143 47.9999 32.5 47.9999C23.6634 47.9999 16.5 40.8364 16.5 31.9999C16.5 23.1633 23.6634 15.9999 32.5 15.9999C35.4143 15.9999 38.1466 16.779 40.5 18.1404V1.00812C37.943 0.350018 35.2624 0 32.5 0C14.8269 0 0.500038 14.3269 0.500038 32C0.500038 49.6731 14.8269 64 32.5 64Z"
        fill="black"
      />
    </svg>
  );
};

// Layouts
const CompanyLayout = () => {
  return (
    <section className="inline-flex mx-3 text-xs">
      <section className="">
        <div
          className={cn(
            BG_COLOR,
            "group",
            "h-max",
            "p-3",
            "rounded-xl",
            "flex flex-col gap-3",
            "hover:bg-green-500/20",
            "my-3 mr-3"
          )}
        >
          <div>
            <h4>Sobre nosotros</h4>
            <p className="mb-3 text-[#171717]/70">Empresa y equipo</p>
          </div>
          <span className="ml-auto">
            <AiFillApi />
          </span>
        </div>
        <div
          className={cn(
            BG_COLOR,
            "group",
            "h-max",
            "p-3",
            "rounded-xl",
            "flex flex-col gap-3",
            "hover:bg-green-500/20",
            "my-3 mr-3"
          )}
        >
          <div>
            <h4>Blog</h4>
            <p className="mb-3 text-[#171717]/70">Ideas e historias</p>
          </div>
          <span className="ml-auto">
            <TfiWrite />
          </span>
        </div>
        <div
          className={cn(
            BG_COLOR,
            "group",
            "h-max",
            "p-3",
            "rounded-xl",
            "flex flex-col gap-3",
            "hover:bg-green-500/20",
            "my-3 mr-3"
          )}
        >
          <div>
            <h4>Customers</h4>
            <p className="mb-3 text-[#171717]/70">
              Historias de éxito y casos de uso
            </p>
          </div>
          <span className="ml-auto">
            <FaHeart />
          </span>
        </div>
      </section>
      <hr className="border-l h-full max-w-2" />
      <ul className="text-gray-700 flex flex-col gap-3 my-3">
        <h4 className="uppercase text-gray-400 text-[10px]">Social</h4>
        <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
          <span className="p-1 border rounded-lg">
            <FaTwitter />
          </span>
          <span className="text-[10px] font-semibold">X(Twitter)</span>
          <span className="group-hover:visible invisible group-hover:translate-x-6 transition-all">
            <FaArrowRight />
          </span>
        </li>
        <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
          <span className="p-1 border rounded-lg">
            <FaLinkedin />
          </span>
          <span className="text-[10px] font-semibold">LinkedIn</span>
          <span className="group-hover:visible invisible group-hover:translate-x-6 transition-all">
            <FaArrowRight />
          </span>
        </li>
        <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
          <span className="p-1 border rounded-lg">
            <FaGithub />
          </span>
          <span className="text-[10px] font-semibold">Github</span>
          <span className="group-hover:visible invisible group-hover:translate-x-6 transition-all">
            <FaArrowRight />
          </span>
        </li>
        <li className="cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
          <span className="p-1 border rounded-lg">
            <FaYoutube />
          </span>
          <span className="text-[10px] font-semibold">Youtube</span>
          <span className="group-hover:visible invisible group-hover:translate-x-6 transition-all">
            <FaArrowRight />
          </span>
        </li>
      </ul>
    </section>
  );
};

const ProductLayout = () => {
  return (
    <section className="grid grid-cols-3 text-xs">
      <div
        className={cn(
          BG_COLOR,
          "group",
          "p-4",
          "rounded-xl",
          "flex flex-col gap-3",
          "hover:bg-[#faefe5]/70",
          "my-3 mx-3"
        )}
      >
        <h4>Fixter Links</h4>
        <p className="mb-3 text-[#171717]/70">
          Link cortos con super poderes para el desarrollaodr independiente
        </p>
        <img
          style={{ maskImage: "linear-gradient(white, #1717170D)" }}
          className="h-40 object-center grayscale group-hover:grayscale-0 object-cover"
          src="/navbar/graph.png"
          alt="ilustration"
        />
      </div>
      <section>
        <div
          className={cn(
            BG_COLOR,
            "group",
            "h-max",
            "p-3",
            "rounded-xl",
            "flex flex-col gap-3",
            "hover:bg-green-500/20",
            "my-3 mr-3"
          )}
        >
          <h4>Fixter Analitics</h4>
          <p className="mb-3 text-[#171717]/70">
            analiticas en tiempo real poderosas con rastreo de conversión
          </p>
        </div>
        <div
          className={cn(
            BG_COLOR,
            "group",
            "h-max",
            "p-3",
            "rounded-xl",
            "flex items-center gap-3",
            "hover:bg-red-500/10",
            "my-3 mr-3"
          )}
        >
          <div className="flex flex-col gap-3">
            <h4>Fixter API</h4>
            <p className="mb-3 text-[#171717]/70">
              Recursos programaticamente a gran escala
            </p>
          </div>
          <span className="text-lg">
            <FaPizzaSlice />
          </span>
        </div>
        <div
          className={cn(
            BG_COLOR,
            "group",
            "h-max",
            "p-3",
            "rounded-xl",
            "flex items-center gap-3",
            "hover:bg-yellow-500/10",
            "my-3 mr-3"
          )}
        >
          <div className="flex flex-col gap-3">
            <h4>Integraciones Fixter</h4>
            <p className="mb-3 text-[#171717]/70">Conecta con Fixter.org</p>
          </div>
          <span className="ml-auto text-xl">
            <AiFillApi />
          </span>
        </div>
      </section>
      <section className="pt-3">
        <ul className="text-gray-700 grid gap-3 mb-3">
          <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40 rounded-lg px-3 w-max">
            <span className="p-1 border rounded-lg">
              <IoLogoFreebsdDevil />
            </span>
            <div className="grid">
              <span className="text-[10px] font-semibold">Elxo</span>
              <span className="text-[8px]">Elimina la latencia</span>
            </div>
          </li>
          <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40 rounded-lg px-3 w-max">
            <span className="p-1 border rounded-lg">
              <FaProductHunt />
            </span>
            <div className="grid">
              <span className="text-[10px] font-semibold">Product Hunt</span>
              <span className="text-[8px]">Desbloquea tu crecimiento</span>
            </div>
          </li>
          <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40 rounded-lg px-3 w-max">
            <span className="p-1 border rounded-lg">
              <SiRaycast />
            </span>
            <div className="grid">
              <span className="text-[10px] font-semibold">Raycast</span>
              <span className="text-[8px]">
                Comparte links programáricamente
              </span>
            </div>
          </li>
        </ul>

        <div className="pr-3 grid gap-2">
          <a
            href="#!"
            className="text-[10px] pl-3 my-3 block font-semibold hover:underline"
          >
            Ver todas las historias
          </a>
          <h4 className="text-gray-400 font-thin uppercase text-[9px]">
            Compara
          </h4>
          <button className="flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="text-[10px] font-semibold">Fixter vs. Bitly</span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </button>
          <button className="flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="text-[10px] font-semibold">
              Fixter vs. Rebrandy
            </span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </button>
          <button className="flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="text-[10px] font-semibold">
              Fixter vs. Short.io
            </span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </button>
          <button className="flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="text-[10px] font-semibold">Fixter vs. Bl.ink</span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </button>
        </div>
      </section>
    </section>
  );
};

const ResourcesLayout = () => {
  return (
    <section className="grid grid-cols-3 text-xs">
      <div
        className={cn(
          BG_COLOR,
          "group",
          "h-max",
          "p-4",
          "rounded-xl",
          "flex flex-col gap-3",
          "hover:bg-[#faefe5]/70",
          "my-3 mx-3"
        )}
      >
        <h4>Docs</h4>
        <p className="mb-3 text-[#171717]/70">Platforma de documentación</p>
        <img
          style={{ maskImage: "linear-gradient(white, #1717170D)" }}
          className="h-40 object-left grayscale group-hover:grayscale-0 object-cover"
          src="/navbar/docs-thumbnail.webp"
          alt="ilustration"
        />
      </div>
      <div
        className={cn(
          BG_COLOR,
          "group",
          "h-max",
          "p-4",
          "rounded-xl",
          "flex flex-col gap-3",
          "hover:bg-green-500/10",
          "my-3 mr-3"
        )}
      >
        <h4>Centro de Ayuda</h4>
        <p className="mb-3 text-[#171717]/70">Respondiendo tus preguntas</p>
        <img
          style={{ maskImage: "linear-gradient(white, #1717170D)" }}
          className="h-40 object-left grayscale group-hover:grayscale-0 object-cover"
          src="/navbar/help-thumbnail.webp"
          alt="ilustration"
        />
      </div>
      <div className="border-l px-3 py-2 grid">
        <h4 className="text-[9px] font-thin text-[#171717]/50 mb-3">SDKS</h4>
        <ul className="text-gray-700 grid gap-3 mb-3">
          <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="p-1 border rounded-lg">
              <BiLogoTypescript />
            </span>
            <span className="text-[10px] font-semibold">Typescript</span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </li>
          <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="p-1 border rounded-lg">
              <BiLogoPython />
            </span>
            <span className="text-[10px] font-semibold">Python</span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </li>
          <li className=" cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="p-1 border rounded-lg">
              <FaGolang />
            </span>
            <span className="text-[10px] font-semibold">Go</span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </li>
          <li className="cursor-pointer flex items-center gap-3 group hover:bg-[#faefe5]/40">
            <span className="p-1 border rounded-lg">
              <DiRubyRough />
            </span>
            <span className="text-[10px] font-semibold">Ruby</span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </li>
          <li className="flex items-center gap-3 group cursor-pointer hover:bg-[#faefe5]/40">
            <span className="p-1 border rounded-lg">
              <RiPhpFill />
            </span>
            <span className="text-[10px] font-semibold">PHP</span>
            <span className="group-hover:visible invisible group-hover:translate-x-20 transition-all">
              <FaArrowRight />
            </span>
          </li>
        </ul>
        <div className="bg-gradient-to-r from-red-950 to-green-900 p-4 rounded-xl mt-auto text-white">
          <h5>Fixter Brand</h5>
          <p className="text-gray-300">Logos, wordmark, etc.</p>
        </div>
      </div>
    </section>
  );
};
