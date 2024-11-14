import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, lazy, useRef, useState } from "react";
import { FaGooglePlay } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { db } from "~/.server/db";
import { EmojiConfetti } from "~/components/EmojiConfetti";
import { Drawer } from "~/components/SimpleDrawer";
import { PrimaryButton } from "~/components/PrimaryButton";
import { getStripeCheckout } from "~/.server/stripe";
import { getUserORNull } from "~/.server/user";
import { NavBar } from "~/components/NavBar";
import { VideosMenu } from "~/components/player/ModulesSideMenu";
import { VideoPlayer } from "~/components/player/VideoPlayer";

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
  const navigate = useNavigate();
  const { isPurchased, video, videos, searchParams, moduleNames } =
    useLoaderData<typeof loader>();
  const [successIsOpen, setSuccessIsOpen] = useState(searchParams.success);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const nextIndex = ((video.index || 0) + 1) % videos.length;
  const nextVideo = videos[nextIndex];

  const handleClickEnding = () => {
    const url = new URL(location.href);
    url.pathname = "/player";
    url.searchParams.set("videoSlug", nextVideo.slug);
    navigate(url.pathname + url.search);
    setIsMenuOpen(true);
  };

  return (
    <>
      <NavBar mode="player" className="m-0" />
      <article className="bg-slate-950 relative overflow-x-hidden pt-20">
        <VideoPlayer
          // @todo visit later
          onClickNextVideo={handleClickEnding}
          type={video.type || undefined}
          src={video.storageLink || undefined}
          poster={video.poster || undefined}
          nextVideo={nextVideo || undefined}
          slug={video.slug}
        />

        <VideosMenu
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          currentVideoSlug={video.slug}
          videos={videos}
          moduleNames={moduleNames.filter((n) => typeof n === "string")}
          defaultOpen={!searchParams.success}
          isLocked={!isPurchased}
        />
      </article>
      {searchParams.success && (
        <>
          <EmojiConfetti />
          <Drawer
            header={<></>}
            cta={<></>}
            className="z-50"
            title="Desbloquea todo el curso"
            isOpen={successIsOpen}
            onClose={() => setSuccessIsOpen(false)}
          >
            <img src="/Logo.png" alt="logo" className="mx-auto w-lg" />
            <h2 className="text-3xl text-center pt-20">
              ¡Has desbloqueado todos los tutoriales! <br /> 🎉 🍾
            </h2>
            <p className="mt-20 text-center">
              Ahora, revisa tu correo para encontrar tu acceso. 🪄
            </p>
          </Drawer>
        </>
      )}
      {!isPurchased && !video.isPublic && (
        <Drawer
          header={<></>}
          cta={<></>}
          className="z-50"
          title="Desbloquea todo el curso"
          isOpen
        >
          <p className="text-xl text-center pt-20 pb-8">
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
          <p className="text-2xl text-center">
            Puedes seguir mirando, y construir conmigo todos los componentes
            paso a paso. <br />
            ¡Desbloquea el curso completo! 🫶🏻
          </p>
          <p className="text-xl text-center pt-20 pb-8">
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
