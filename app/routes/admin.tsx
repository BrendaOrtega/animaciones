import { type Video } from "@prisma/client";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { FormEvent, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { db } from "~/.server/db";
import { PrimaryButton } from "~/components/PrimaryButton";
import { Drawer } from "~/components/SimpleDrawer";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useClickOutside } from "~/hooks/useClickOutside";
import slugify from "slugify";
import { cn } from "~/lib/utils";
import { getComboURLs, removeFilesFor } from "~/.server/tigris";
import { getUserOrRedirect } from "~/.server/user";
import { VideoForm } from "~/components/admin/VideoForm";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "get_combo_urls") {
    const storageKey = String(formData.get("storageKey"));
    // @todo should throw?
    return await getComboURLs(storageKey);
  }
  if (intent === "delete_video") {
    const id = String(formData.get("videoId"));
    await db.video.delete({ where: { id } });
    removeFilesFor(id);
  }
  if (intent === "update_modulename") {
    const oldModuleName = String(formData.get("oldModuleName"));
    const newModuleName = String(formData.get("newModuleName"));
    await db.video.updateMany({
      where: {
        moduleName: oldModuleName,
      },
      data: { moduleName: newModuleName },
    });
  }
  if (intent === "update_video") {
    const data = JSON.parse(formData.get("data") as string) as Video;
    data.courseIds = ["645d3dbd668b73b34443789c"]; // forcing this course
    data.slug = slugify(data.title, { lower: true }); // @todo zod
    data.index = data.index ? Number(data.index) : undefined;
    data.storageLink = "/videos?storageKey=" + data.storageKey; // video experiment

    // if exists
    if (data.id) {
      const id = data.id;
      delete data.id; // improve
      await db.video.update({
        where: {
          id,
        },
        data, // data includes storageKey
      });
      return null;
    }
    await db.video.create({ data });
  }
  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserOrRedirect({ request });
  if (user.role !== "ADMIN") return redirect("/");

  const course = await db.course.findUnique({
    where: { id: "645d3dbd668b73b34443789c" },
  });
  const videos = await db.video.findMany({
    where: {
      courseIds: {
        has: "645d3dbd668b73b34443789c",
      },
    },
    orderBy: { index: "asc" },
  });
  if (!course) throw json(null, { status: 404 });
  const moduleNames = [...new Set(videos.map((video) => video.moduleName))];
  // const storageKey =  "animations_" + nanoid() + ".mov"; // @todo improve
  // const [putURL, deleteURL] = await getReadAndDeletePair(storageKey);
  return { course, videos, moduleNames };
};

const initialVideo = {
  title: "Nuevo video",
  moduleName: "",
};
export default function Route() {
  const { course, moduleNames, videos } = useLoaderData<typeof loader>();
  const [video, setVideo] = useState<Partial<Video>>(initialVideo);
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);
  const [modules, setModules] = useState(moduleNames);

  const handleModuleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget.name.value;
    e.currentTarget.name.value = "";
    if (!name) return;
    setModules((ms) => [...ms, name]);
  };

  const handleAddVideo = (moduleName: string) => {
    setShowVideoDrawer(true);
    setVideo((v) => ({ ...v, moduleName }));
  };

  const handleVideoEdit = (video: Partial<Video>) => {
    setVideo(video);
    setShowVideoDrawer(true);
  };

  const handleModuleTitleUpdate = (prev: string, nuevo: string) => {
    setModules((m) => m.map((mod) => (mod === prev ? nuevo : mod)));
    // @todo update all videos
  };

  return (
    <>
      <article className="bg-gradient-to-tr from-slate-950 to-indigo-950 min-h-screen py-20 px-8">
        <h1 className="text-gray-50 text-2xl mb-6">{course.title}</h1>
        <form
          onSubmit={handleModuleSubmit}
          className="flex items-center justify-end gap-4"
        >
          <input
            name="name"
            type="text"
            placeholder="Nombre del nuevo módulo"
            className="py-3 px-6 text-lg rounded-full"
          />
          <PrimaryButton type="submit" className="bg-green-500">
            Añadir módulo
          </PrimaryButton>
        </form>
        <section className="my-8 flex gap-4 flex-wrap">
          {modules.map((moduleTitle, i) => (
            <Module
              index={i}
              onModuleTitleUpdate={handleModuleTitleUpdate}
              onVideoSelect={handleVideoEdit}
              onAddVideo={() => moduleTitle && handleAddVideo(moduleTitle)}
              key={moduleTitle}
              title={moduleTitle || ""}
              videos={videos.filter(
                (video) => video.moduleName === moduleTitle
              )}
            />
          ))}
        </section>
      </article>
      {/* drawer */}
      <Drawer
        onClose={() => {
          setShowVideoDrawer(false);
          setVideo({});
        }}
        isOpen={showVideoDrawer}
        title={video.id ? "Editar video" : "Añadir video"}
        cta={<></>} // remove cancel button
      >
        <VideoForm
          nextIndex={videos.length}
          onSubmit={() => {
            setVideo(initialVideo);
            setShowVideoDrawer(false);
          }}
          video={video}
        />
      </Drawer>
    </>
  );
}

const Module = ({
  title,
  videos = [],
  onAddVideo,
  onVideoSelect,
  onModuleTitleUpdate,
  index,
}: {
  index?: number;
  onModuleTitleUpdate?: (arg0: string, arg1: string) => void;
  onVideoSelect?: (arg0: Partial<Video>) => void;
  onAddVideo?: (arg0?: string) => void;
  videos: Video[];
  title: string;
}) => {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useClickOutside({
    isActive: isEditing,
    includeEscape: true,
    onOutsideClick: () => {
      setIsEditing(false);
    },
  });

  const handleAddVideo = () => {
    // do stuff with title openDrawer?
    onAddVideo?.(title);
  };

  const handleModuleTitleUpdate = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.title.value;
    if (!value) return;
    onModuleTitleUpdate?.(title, value);
    fetcher.submit(
      {
        intent: "update_modulename",
        oldModuleName: title,
        newModuleName: value,
      },
      { method: "post" }
    );
  };

  return (
    <article className="w-64">
      <section className="bg-slate-600 py-2 px-4 flex justify-between items-center mt-2 ">
        {isEditing ? (
          <form ref={ref} onSubmit={handleModuleTitleUpdate}>
            <input
              defaultValue={title}
              autoFocus
              className="rounded py-1 px-2"
              placeholder="Escribe un nuevo titulo"
              name="title"
            />
          </form>
        ) : (
          <>
            <span className="text-gray-400"> {index + 1}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-white font-bold capitalize text-left"
            >
              {title ? title : "Sin título"}
            </button>
          </>
        )}
        <button
          className="flex-grow flex justify-end"
          onClick={() => setIsOpen((o) => !o)}
        >
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </section>
      {isOpen && (
        <section className="min-h-20 bg-slate-300 p-4 flex flex-col gap-2 group">
          {videos.length < 1 && (
            <p className="text-center py-6">No hay videos</p>
          )}
          {videos
            .sort((a, b) => (a.index < b.index ? -1 : 1))
            .map((video, index) => (
              <Video
                onClick={() => onVideoSelect?.(video)}
                key={video.id}
                video={video}
              />
            ))}
          <PrimaryButton
            onClick={handleAddVideo}
            className="group-hover:visible invisible ml-auto"
          >
            Añadir video
          </PrimaryButton>
        </section>
      )}
    </article>
  );
};

const Video = ({ video, onClick }: { onClick?: () => void; video: Video }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "transition-all hover:scale-[1.02] text-left py-1 px-4 rounded",
        video.isPublic ? "bg-green-500" : "bg-slate-400",
        "flex justify-between"
      )}
    >
      <p className="truncate">{video.title}</p>
      <span>{video.storageKey ? "✅" : "🫥"}</span>
    </button>
  );
};
