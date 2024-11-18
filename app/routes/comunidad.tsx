import { Link } from "@remix-run/react";
import { ReactNode } from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PiLinkSimpleBold } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { NavBar } from "~/components/NavBar";
import { PrimaryButton } from "~/components/PrimaryButton";
import { cn } from "~/lib/utils";
import { FcGoogle } from "react-icons/fc";

export default function Route() {
  return (
    <article className=" ">
      <NavBar />
      <Sharing />
      <Invite />
    </article>
  );
}

const Invite = () => {
  return (
    <section className="flex flex-col items-center h-screen justify-center gap-4">
      <img className="w-52 h-auto" src="/congrats.png" />
      <h2 className="text-3xl md:text-5xl font-semibold text-center">
        ¡Andas de suerte eh! ☘️
      </h2>
      <p className="text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8">
        Tu amig@ fulanito te ha compartido un descuento del
        <strong className="font-bold">
          {" "}
          50% para el curso «Animaciones con React»
        </strong>
      </p>
      <p className=" text-xl md:text-3xl text-center mb-12 text-fish">
        Usa el cupón #PAIRPROGRAMMINGXEVER
      </p>
      <div className="flex-wrap md:flex-nowrap justify-center items-center flex gap-4 md:gap-6">
        <PrimaryButton>Comprar curso $498 mxn</PrimaryButton>
        <Link to="/">
          <button className="bg-[#F5F5F5] md:mt-0 mx-auto font-normal text-gray-600 rounded-full enabled:hover:px-8 transition-all text-base md:text-lg  h-12 md:h-14 px-6 flex gap-2 items-center justify-center ">
            Ver detalle del curso
          </button>
        </Link>
      </div>
    </section>
  );
};

const Sharing = () => {
  return (
    <section className="flex flex-col items-center h-screen px-4 md:px-0 justify-center gap-4">
      <img className="w-52 h-auto" src="/like.png" alt="logo " />
      <h2 className="text-3xl md:text-5xl  text-center font-semibold">
        Comparte este súper descuento con tus amigos 💪🏻
      </h2>
      <p className="text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8">
        Todos tus amigos obtienen{" "}
        <strong className="font-bold"> 50% de descuento</strong> con tu link.{" "}
        <br /> De eso se trata la comunidad ¡de compartir 🫂!
      </p>
      <div className=" bg-lightGray/20  flex relative w-full md:w-[480px] gap-2 h-16 rounded-full border border-lightGray  ">
        <input
          disabled={true}
          name="email"
          type="email"
          placeholder="brendi@ejemplo.com"
          className={cn(
            "  py-2 px-6 w-full h-full bg-transparent rounded-full border-none focus:border-none focus:ring-indigo-500"
          )}
        />
      </div>
      <div className="flex gap-3 mt-3">
        <SocialMedia
          name="Link"
          className="bg-[#F0A13A] text-[#ffffff] hover:bg-[#F0A13A] hover:text-white"
        >
          <PiLinkSimpleBold />
        </SocialMedia>
        <SocialMedia
          name="Facebook"
          className="bg-[#357BEB] text-[#ffffff] hover:bg-[#357BEB] hover:text-white"
        >
          <FaFacebookF />
        </SocialMedia>
        <SocialMedia
          name="X"
          className="bg-[#171717] text-[#ffffff] hover:bg-[#171717] hover:text-white"
        >
          <FaXTwitter />
        </SocialMedia>
        <SocialMedia
          name="Linkedin"
          className="bg-[#2967BC] text-[#ffffff] hover:bg-[#2967BC] hover:text-white"
        >
          <FaLinkedinIn />
        </SocialMedia>
        <SocialMedia
          name="Gmail"
          className="bg-[#73C56B] text-[#171717] hover:bg-[#73C56B] hover:text-white"
        >
          <FcGoogle />
        </SocialMedia>
      </div>
    </section>
  );
};

const SocialMedia = ({
  className,
  children,
  name,
}: {
  className: string;
  children: ReactNode;
  name?: string;
}) => {
  return (
    <div
      className={twMerge(
        "group rounded-full w-12 hover:scale-125 transition-all h-12 text-xl flex items-center justify-center relative",
        className
      )}
    >
      {children}
      <span
        className={twMerge(
          "absolute bg-dark -bottom-6 text-xs text-white px-1 rounded hidden group-hover:block"
        )}
      >
        {name}
      </span>
    </div>
  );
};
