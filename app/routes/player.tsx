import { Video } from "@prisma/client";
import { nanoid } from "nanoid";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useEffect, useRef, useState, useTransition } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { FaGooglePlay, FaPlay } from "react-icons/fa6";
import { IoIosClose, IoMdLock } from "react-icons/io";
import {
  MdMenuOpen,
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";
import { db } from "~/.server/db";
import { EmojiConfetti } from "~/components/EmojiConfetti";
import { useClickOutside } from "~/hooks/useClickOutside";
import { cn } from "~/lib/utils";
import { Drawer } from "~/components/SimpleDrawer";
import { PrimaryButton } from "~/components/PrimaryButton";
import { getStripeCheckout } from "~/.server/stripe";
import { getUserORNull } from "~/.server/user";

const video = {
  title: "¿Qué son las future flags?",
  poster: "https://i.imgur.com/nITUzj1.png",
  type: "video/mov",
  src: "https://firebasestorage.googleapis.com/v0/b/fixter-67253.appspot.com/o/fixtergeek.com%2Fmicro-cursos%2Fintrocss%2F1_boxModel.mov?alt=media&token=54cc5e8a-0f90-4df8-9c98-cedfeef6c765",
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "checkout") {
    const url = await getStripeCheckout();
    return redirect(url);
  }
  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  // @todo specific video
  const videos = await db.video.findMany({
    where: {
      courseIds: {
        has: "645d3dbd668b73b34443789c",
      },
    },
    select: {
      title: true,
      id: true,
      slug: true,
      moduleName: true,
      duration: true,
      index: true,
      poster: true,
      isPublic: true,
    },
  });
  const video = await db.video.findUnique({
    where: {
      slug: searchParams.get("videoSlug") || videos[0].slug,
    },
  });
  if (!video) throw json(null, { status: 404 });
  const moduleNames = [...new Set(videos.map((video) => video.moduleName))];
  const user = await getUserORNull(request);
  const isPurchased = user
    ? user.courses.includes("645d3dbd668b73b34443789c")
    : false;
  return {
    user,
    isPurchased,
    video:
      !isPurchased && !video.isPublic ? { ...video, storageLink: "" } : video,
    videos,
    moduleNames,
    searchParams: {
      success: searchParams.get("success") === "1",
    },
  };
};

export default function Route() {
  const { isPurchased, video, videos, searchParams, moduleNames } =
    useLoaderData<typeof loader>();
  const [isLoading, setIsLoading] = useState(false);
  const handleClickEnding = () => {
    // @TODO: change to next video (navigate?)
  };
  const nextIndex = (video.index + 1) % videos.length;
  const nextVideo = videos[nextIndex];
  return (
    <>
      <article className="bg-slate-950 relative overflow-x-hidden">
        <VideoPlayer
          onClickNextVideo={handleClickEnding}
          type={video.type}
          src={video.storageLink}
          poster={video.poster}
          nextVideo={nextVideo}
          slug={video.slug}
        />
        <VideosMenu
          currentVideoSlug={video.slug}
          videos={videos}
          moduleNames={moduleNames}
          defaultOpen={!searchParams.success}
          isLocked={!isPurchased}
        />
      </article>
      {searchParams.success && <EmojiConfetti />}
      {!isPurchased && !video.isPublic && (
        <Drawer
          header={<></>}
          cta={<></>}
          className="z-50"
          title="Desbloquea todo el curso"
          isOpen
        >
          <p className="text-2xl text-center pt-20 pb-8">
            Recuerda que el código de los componentes es Open Source y puedes{" "}
            <a
              className="text-blue-500 hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/marianaLz/fun-components"
            >
              copiarlos
            </a>{" "}
            libremente para tus proyectos. 😎
          </p>
          <p className="text-3xl text-center">
            Puedes seguir mirando, y construir conmigo todos los componentes
            paso a paso. <br />
            ¡Desbloquea el curso completo! 🫶🏻
          </p>
          <p className="text-2xl text-center pt-20 pb-8">
            Si estás aquí justo después de tu compra, no olvides revisar tu
            bandeja de spam, para encontrar tu acceso. 😅
          </p>
          <Form method="POST">
            <PrimaryButton
              // auto loading
              onClick={() => setIsLoading(true)}
              isLoading={isLoading}
              name="intent"
              value="checkout"
              type="submit"
              className="font-bold w-full mt-20 hover:tracking-wide"
            >
              ¡Que siga la magia! 🎩🪄
            </PrimaryButton>
          </Form>
        </Drawer>
      )}
    </>
  );
}

const VideosMenu = ({
  videos,
  defaultOpen,
  moduleNames,
  currentVideoSlug,
}: {
  currentVideoSlug?: string;
  moduleNames: string[];
  videos: Partial<Video>[];
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const x = useMotionValue(0);
  const springX = useSpring(x, { bounce: 0.2 });
  const buttonX = useTransform(springX, [-400, 0], [0, 394]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    isOpen ? x.set(0) : x.set(-400);
  }, [isOpen, x]);

  const checkIfWatched = (slug: string) => {
    if (typeof window === "undefined") return;
    let list = localStorage.getItem("watched") || "[]";
    list = JSON.parse(list);
    return list.includes(slug);
  };

  useEffect(() => {
    const list: string[] = [];
    moduleNames.map((moduleName) => {
      const allCompleted = videos
        .filter((vi) => vi.moduleName === moduleName)
        .every((v) => checkIfWatched(v.slug));
      allCompleted && list.push(moduleName);
    });
    setCompleted(list);
  }, []);

  return (
    <>
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
        {moduleNames.map((moduleName, index) => {
          return (
            <div key={index}>
              <ModuleHeader
                title={moduleName}
                subtitle={"capitulo 0" + (index + 1)}
                isCompleted={completed.includes(moduleName)}
              />
              {videos
                .filter((vid) => vid.moduleName === moduleName)
                .map((v) => (
                  <ListItem
                    // why this is not receiving the video as a prop?
                    isLocked={!v.isPublic}
                    // isCompleted={checkIfWatched(v.slug)}
                    isCurrent={currentVideoSlug === v.slug}
                    slug={v.slug || ""}
                    key={v.id}
                    title={v.title || ""}
                    duration={v.duration || 60}
                  />
                ))}
            </div>
          );
        })}
      </MenuListContainer>
    </>
  );
};

const ListItem = ({
  isCompleted,
  duration,
  title,
  isCurrent,
  slug,
  isLocked,
}: {
  isLocked?: boolean;
  slug: string;
  isCurrent?: boolean;
  duration: number | string;
  isCompleted?: boolean;
  title: string;
}) => {
  return (
    <Link
      to={`/player?videoSlug=${slug}`}
      // to="perro"
      reloadDocument
      className={cn(
        "text-gray-600 pl-2 flex py-4 hover:bg-gray-900 rounded-2xl hover:text-gray-400 transition-all items-center",
        {
          "bg-gray-800 my-1 hover:text-white text-white hover:bg-gray-800":
            isCurrent,
          "cursor-pointer": !isLocked,
          "cursor-not-allowed": isLocked,
        }
      )}
    >
      <span
        className={cn("text-2xl pl-8", {
          "text-green-500": isCompleted,
          "p-2 bg-indigo-500 rounded-full": isCurrent,
        })}
      >
        {isCurrent ? (
          <FaPlay />
        ) : isCompleted ? (
          <MdOutlineRadioButtonChecked />
        ) : (
          <MdOutlineRadioButtonUnchecked />
        )}
      </span>
      <div className="capitalize text-sm pl-8">{title}</div>
      {isLocked ? (
        <span className="ml-auto pr-8">
          <IoMdLock />
        </span>
      ) : (
        <div className="text-xs pl-auto ml-auto pr-8">{duration}m</div>
      )}
    </Link>
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
      className="bg-gray-950 md:w-[380px] w-[300px] absolute z-20 inset-2 rounded-xl overflow-y-scroll h-[88%]"
    >
      {children}
    </motion.div>
  );
};

const ModuleHeader = ({
  title,
  subtitle,
  isCompleted,
}: {
  isCompleted?: boolean;
  title: string;
  subtitle?: string;
}) => {
  return (
    <header className="text-indigo-600 rounded-lg pl-9 py-3 bg-gray-800 flex items-center gap-4 mb-2">
      <span className={cn("text-4xl", isCompleted && "text-green-500")}>
        {isCompleted ? (
          <MdOutlineRadioButtonChecked />
        ) : (
          <MdOutlineRadioButtonUnchecked />
        )}
      </span>
      <div>
        <p className="font-sans capitalize font-extrabold text-white">
          {subtitle}
        </p>
        <h3
          className={cn("text-2xl font-bold font-sans capitalize", {
            "text-green-500": isCompleted,
          })}
        >
          {title}
        </h3>
      </div>
    </header>
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
        "absolute bg-gray-900 text-4xl w-20 h-20 text-white top-16 z-20 flex items-center justify-center rounded-r-2xl hover:bg-gray-800",
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
            initial={{ filter: "blur(4px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(4px)", opacity: 0 }}
          >
            <MdMenuOpen />
          </motion.span>
        ) : (
          <motion.span
            initial={{ filter: "blur(4px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(4px)", opacity: 0 }}
            key="close"
          >
            <BsMenuButtonWide />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const VideoPlayer = ({
  src,
  type = "video/mov",
  onPlay,
  onClickNextVideo,
  poster,
  onEnd,
  nextVideo = video,
  slug,
}: {
  slug: string;
  nextVideo?: typeof video;
  poster?: string;
  onClickNextVideo?: () => void;
  onEnd?: () => void;
  type?: string;
  src?: string;
  onPlay?: () => void;
}) => {
  // @TODO initiate loading with no play button
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const togglePlay = () => {
    const controls = videoRef.current || null;
    if (!controls) return;
    // main action
    if (controls.paused) {
      controls.play();
      onPlay?.();
    } else {
      controls.pause();
    }
    setIsPlaying(!controls.paused);
    // listeners
    controls.onplaying = () => setIsPlaying(true);
    controls.onplay = () => setIsPlaying(true);
    controls.onpause = () => setIsPlaying(false);
    controls.onended = () => onEnd?.();
    controls.ontimeupdate = () => {
      if (controls.duration - controls.currentTime < 15) {
        setIsEnding(true);
        // save watched videos
        updateWatchedList();
      } else {
        setIsEnding(false);
      }
    };
  };

  const updateWatchedList = () => {
    if (typeof window === "undefined") return;
    let list = localStorage.getItem("watched") || "[]";
    list = JSON.parse(list);
    list = [...new Set([...list, slug])];
    localStorage.setItem("watched", JSON.stringify(list));
  };

  return (
    <section className="h-screen relative overflow-x-hidden">
      <AnimatePresence>
        {!isPlaying && (
          <motion.button
            onClick={togglePlay}
            initial={{ backdropFilter: "blur(4px)" }}
            animate={{ backdropFilter: "blur(4px)" }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="play_button"
            className="absolute inset-0 bottom-16 flex justify-center items-center cursor-pointer z-10"
          >
            <span className="border flex items-center justify-center text-6xl text-white rounded-full bg-indigo-500 w-[120px] h-[90px]">
              <FaGooglePlay />
            </span>
          </motion.button>
        )}
        {nextVideo.index !== 0 && isEnding && (
          <motion.button
            onClick={onClickNextVideo}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", bounce: 0.2 }}
            whileHover={{ scale: 1.05 }}
            exit={{ opacity: 0, filter: "blur(9px)", x: 50 }}
            initial={{ opacity: 0, filter: "blur(9px)", x: 50 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            className="absolute right-2 bg-gray-100 z-20 bottom-20 md:top-4 md:right-4 md:left-auto md:bottom-auto left-2 md:w-[500px] px-6 md:pt-6 pt-10 pb-6 rounded-3xl flex gap-4 shadow-sm items-end"
          >
            <button
              onClick={() => setIsEnding(false)}
              className="self-end text-4xl active:scale-95 md:hidden absolute right-4 top-1"
            >
              <IoIosClose />
            </button>
            <div>
              <p className="text-left text-lg">Siguiente video</p>
              <h4 className="text-2xl md:w-[280px] md:truncate text-left">
                {nextVideo.title}
              </h4>
            </div>
            <img
              alt="poster"
              src={nextVideo.poster || poster}
              onError={(e) => {
                e.target.src = poster;
                e.target.error = false;
              }}
              className="aspect-video w-40 rounded-xl"
            />
          </motion.button>
        )}
      </AnimatePresence>
      <video
        poster={poster}
        controlsList="nodownload"
        ref={videoRef}
        className="w-full h-full"
        controls
        src={src}
      >
        <track kind="captions" />
        <source src={src} type={type} />
      </video>
    </section>
  );
};

// @TODO: make next video a component
