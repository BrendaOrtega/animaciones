import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { ReactNode } from "react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PiLinkSimpleBold } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { NavBar } from "~/components/NavBar";
import { cn } from "~/lib/utils";
import { getCanShareUserORNull } from "~/.server/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getStripeCheckout } from "~/.server/stripe";
import { FcGoogle } from "react-icons/fc";
import { PrimaryButton } from "~/components/PrimaryButton";

const isDev = process.env.NODE_ENV === "development";
const secret = "fixtergeek2024" + isDev;
const ROLE = "CAN_SHARE_50_DISCOUNT";

const generateLink = (token: string) =>
  (isDev ? `http://localhost:3000` : `https://animations.fly.dev`) +
  "/comunidad?token=" +
  token;

const getToken = (email: string) => {
  // @todo no expiration?
  return jwt.sign({ email }, secret, { expiresIn: "24h" });
};

const validateToken = (token: string) => {
  let result;
  try {
    const r = jwt.verify(token, secret) as JwtPayload;
    result = { ...r, success: true };
  } catch (e) {
    result = { success: false };
  }
  console.log("result: ", result);
  return result;
};

// apply discount
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === ROLE) {
    const stripeURL = await getStripeCheckout({
      // coupon: "PAIRPROGRAMMINGXEVER",
    });
    return redirect(stripeURL);
  }
  return null;
};

// this is just a personalized checkout
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  if (searchParams.has("token")) {
    const token = searchParams.get("token") as string;
    const tokenResult = validateToken(token);
    if (tokenResult.success) {
      return {
        screen: "discount",
        link: generateLink(token),
      };
    } else {
      return { screen: "bad_token", link: token };
    }
  }
  // default
  // animaciones course: @todo dynamic?
  const user = await getCanShareUserORNull("645d3dbd668b73b34443789c", request);
  if (user?.email) {
    const token = getToken(user.email);
    return {
      screen: "default",
      link: generateLink(token),
    };
  }
  return redirect("/");
};

export default function Route() {
  const {
    screen,
    link,
    courseTitle = "Construye más de 14 componentes animados con React y Motion",
  } = useLoaderData<typeof loader>();
  switch (screen) {
    case "discount":
      return (
        <>
          <NavBar />
          <Invite courseTitle={courseTitle} />
        </>
      );
    case "bad_token":
      return <BadToken />;
    default:
      return (
        <>
          <NavBar />
          <Sharing link={link} />
        </>
      );
  }
}

const BadToken = () => {
  return (
    <section className="flex flex-col items-center h-screen justify-center gap-4">
      <img className="w-52 h-auto" src="/robot-llora.png" />
      <h2 className="text-3xl md:text-5xl font-semibold text-center">
        ¡Hoy no hay suerte! ☘️
      </h2>
      <p className="text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8">
        Tu amig@ te ha compartido un descuento del 50% para un curso,
        <br />
        <strong className="font-bold">pero el token ya no sirve</strong>
      </p>
      <p className=" text-xl md:text-3xl text-center mb-12 text-fish">
        El Token es <strong>inutilizable</strong>
      </p>
      <p className="text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8">
        Los tokens solo viven unas horas 😭
      </p>
      <div className="flex-wrap md:flex-nowrap justify-center items-center flex gap-4 md:gap-6">
        <PrimaryButton
          // onClick={handleClick}
          // isDisabled={fetcher.state !== "idle"}
          className="active:shadow"
        >
          Comprar de todas formas 🪄
        </PrimaryButton>
        <button className="bg-[#F5F5F5] md:mt-0 mx-auto font-normal text-gray-400 rounded-full enabled:hover:px-8 transition-all text-base md:text-lg  h-12 md:h-14 px-6 flex gap-2 items-center justify-center cursor-not-allowed">
          Reclamar a tu amigo
        </button>
        <Link to="/">
          <button className="bg-[#F5F5F5] md:mt-0 mx-auto font-normal text-gray-600 rounded-full enabled:hover:px-8 transition-all text-base md:text-lg  h-12 md:h-14 px-6 flex gap-2 items-center justify-center ">
            Ver detalle del curso
          </button>
        </Link>
      </div>
    </section>
  );
};

const Invite = ({ courseTitle }: { courseTitle: string }) => {
  const fetcher = useFetcher();
  const handleClick = () => {
    fetcher.submit(
      {
        intent: ROLE,
      },
      { method: "POST" }
    );
  };
  return (
    <section className="flex flex-col items-center h-screen justify-center gap-4">
      <img className="w-52 h-auto" src="/congrats.png" />
      <h2 className="text-3xl md:text-5xl font-semibold text-center">
        ¡Andas de suerte eh! ☘️
      </h2>
      <p className="text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8">
        Tu amig@ te ha compartido un descuento del
        <strong className="font-bold">
          {" "}
          50% para el curso <br />«{courseTitle}»
        </strong>
      </p>
      <p className=" text-xl md:text-3xl text-center mb-12 text-fish">
        Usa el cupón #PAIRPROGRAMMINGXEVER
      </p>
      <div className="flex-wrap md:flex-nowrap justify-center items-center flex gap-4 md:gap-6">
        <PrimaryButton
          onClick={handleClick}
          isDisabled={fetcher.state !== "idle"}
          className="active:shadow"
        >
          Reclamar cupón: $498 mxn
        </PrimaryButton>
        <Link to="/">
          <button className="bg-[#F5F5F5] md:mt-0 mx-auto font-normal text-gray-600 rounded-full enabled:hover:px-8 transition-all text-base md:text-lg  h-12 md:h-14 px-6 flex gap-2 items-center justify-center ">
            Ver detalle del curso
          </button>
        </Link>
      </div>
    </section>
  );
};

const Sharing = ({ link }: { link: string }) => {
  const handleSocialClick = () => {
    navigator.clipboard.writeText(link);
  };
  return (
    <section className="flex flex-col items-center h-screen px-4 md:px-0 justify-center gap-4">
      <img className="w-52 h-auto" src="/like.png" alt="logo " />
      <h2 className="text-3xl md:text-5xl  text-center font-semibold">
        Comparte este súper descuento <br />
        con tus amigos 💪🏻
      </h2>
      <p className="text-xl text-center dark:text-metal text-iron font-light mt-0 mb-8">
        Todos tus amigos obtienen{" "}
        <strong className="font-bold"> 50% de descuento</strong> con tu link.{" "}
        <br /> De eso se trata la comunidad ¡de compartir 🫂!
      </p>
      <button
        // @todo: copiado toast
        onClick={() => {
          navigator.clipboard.writeText(link);
        }}
        className=" bg-lightGray/20  flex relative w-full md:w-[480px] gap-2 h-16 rounded-full border border-lightGray active:scale-95 transition-all"
      >
        <input
          defaultValue={link}
          disabled={true}
          name="email"
          type="email"
          placeholder="brendi@ejemplo.com"
          className={cn(
            "  py-2 px-6 w-full h-full bg-transparent rounded-full border-none focus:border-none focus:ring-indigo-500 truncate pointer-events-none"
          )}
        />
      </button>
      <div className="flex gap-3 mt-3">
        <SocialMedia
          onClick={handleSocialClick}
          name="Link"
          className="bg-[#F0A13A] text-[#ffffff] hover:bg-[#F0A13A] hover:text-white"
        >
          <PiLinkSimpleBold />
        </SocialMedia>
        <SocialMedia
          onClick={handleSocialClick}
          name="Facebook"
          className="bg-[#357BEB] text-[#ffffff] hover:bg-[#357BEB] hover:text-white"
        >
          <FaFacebookF />
        </SocialMedia>
        <SocialMedia
          onClick={handleSocialClick}
          name="X"
          className="bg-[#171717] text-[#ffffff] hover:bg-[#171717] hover:text-white"
        >
          <FaXTwitter />
        </SocialMedia>
        <SocialMedia
          onClick={handleSocialClick}
          name="Linkedin"
          className="bg-[#2967BC] text-[#ffffff] hover:bg-[#2967BC] hover:text-white"
        >
          <FaLinkedinIn />
        </SocialMedia>
        <SocialMedia
          onClick={handleSocialClick}
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
  onClick,
}: {
  className: string;
  children: ReactNode;
  name?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
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
    </button>
  );
};
