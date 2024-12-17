import { type Video } from "@prisma/client";
import { json, useFetcher, useFetchers, useLoaderData } from "@remix-run/react";
import { FormEvent, MouseEvent, PointerEventHandler, useState } from "react";
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
import {
  getComboURLs,
  getMultipartURLs,
  getUploadWithMultiPart,
  removeFilesFor,
} from "~/.server/tigris";
import { getUserOrRedirect } from "~/.server/user";
import { VideoForm } from "~/components/admin/VideoForm";
import { createVideoVersions, experiment } from "~/.server/videoProcessing";
import { motion, LayoutGroup, useDragControls } from "motion/react";
import { GrDrag } from "react-icons/gr";

const MAX_CHUNK_SIZE = 5 * 1024 * 1024;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update_modules_order") {
    const moduleNamesOrder = JSON.parse(
      formData.get("moduleNamesOrder") as string
    );
    const courseId = formData.get("courseId") as string;
    if (!moduleNamesOrder.length || !courseId) return null;

    await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        moduleNamesOrder,
      },
    });
  }

  if (intent === "experiment") {
    console.log("::EXPERIMENT_VERSIONS_GENERATION::");
    const storageKey = String(formData.get("storageKey"));
    experiment(storageKey);
    return json(null, { status: 200 });
  }

  if (intent === "generate_video_versions") {
    const videoId = String(formData.get("videoId"));
    const originalKey = String(formData.get("storageKey"));
    const newStorageKeys = await createVideoVersions({
      originalKey,
      version: "small",
    });
    console.log("TOOOODO para: ", newStorageKeys, "funciona?");
  }

  if (intent === "get_multipart_upload") {
    const storageKey = String(formData.get("storageKey"));
    const numberOfParts = formData.has("numberOfParts")
      ? Number(formData.get("numberOfParts"))
      : 0;
    // @todo should throw?
    const { UploadId }: { UploadId: string } = await getUploadWithMultiPart(
      "multipart_testing"
    );

    // @todo get all presignedURls
    const uploadPayload = {
      storageKey,
      UploadId,
      numberOfParts,
      chunkSize: MAX_CHUNK_SIZE,
      presignedUrls: [] as string[],
    };
    const presignedUrls = await getMultipartURLs(uploadPayload);
    uploadPayload.presignedUrls = presignedUrls;
    console.log("MULTIPART_UPLOAD_REQUESTED", uploadPayload);
    return uploadPayload;
  }
  if (intent === "get_combo_urls") {
    const storageKey = String(formData.get("storageKey"));
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
    data.storageLink = "/videos?storageKey=" + data.storageKey; // experiment?

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
  if (user.role !== "ADMIN") throw redirect("/");

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
  const moduleNamesOrder = course.moduleNamesOrder.length
    ? [...course.moduleNamesOrder]
    : [...new Set(videos.map((video) => video.moduleName))];
  return { course, videos, moduleNamesOrder };
};

const initialVideo = {
  title: "Nuevo video",
  moduleName: "",
};
export default function Route() {
  const fetcher = useFetcher();
  const { course, moduleNamesOrder, videos } = useLoaderData<typeof loader>();
  const [video, setVideo] = useState<Partial<Video>>(initialVideo);
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);
  const [modules, setModules] = useState(moduleNamesOrder);

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

  const handleModuleOrderUpdate = (oldIndex: number, newIndex: number) => {
    const names = [...modules];
    const moving = names.splice(oldIndex, 1)[0];
    names.splice(newIndex, 0, moving);
    setModules(names);
    // server
    fetcher.submit(
      {
        intent: "update_modules_order",
        moduleNamesOrder: JSON.stringify(names),
        courseId: course.id,
      },
      { method: "post" }
    );
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
        <LayoutGroup>
          <section className="my-8 grid gap-4 max-w-7xl mx-auto grid-cols-1 lg:grid-cols-3">
            {modules.map((moduleTitle, i) => (
              <Module
                onModuleOrderUpdate={handleModuleOrderUpdate}
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
        </LayoutGroup>
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
          // @todo sugerir indice, empieza a tener sentido el módulo, cuando menos como meta referencia? 🤫
          onSubmit={() => {
            setVideo(initialVideo);
            setShowVideoDrawer(false);
          }}
          video={video}
          videosLength={videos.length}
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
  onModuleOrderUpdate,
  index,
}: {
  index?: number;
  onModuleTitleUpdate?: (arg0: string, arg1: string) => void;
  onModuleOrderUpdate?: (oldIndex: number, newIndex: number) => void;
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
  const controls = useDragControls();

  const handleDragEnd = (event: MouseEvent) => {
    const all = document.elementsFromPoint(event.clientX, event.clientY);
    const found = all.find(
      (node) => node.dataset.index && node.dataset.index !== String(index)
    );
    if (found) {
      // update ui!
      onModuleOrderUpdate?.(Number(index), Number(found.dataset.index));
      // update db?
    }
  };

  return (
    <motion.article
      layout
      key={title}
      layoutId={title}
      className="relative"
      drag
      dragControls={controls}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
      data-index={index}
      dragListener={false}
    >
      <section className="bg-slate-600 py-2 px-4 flex justify-between items-center mt-2 ">
        <Dragger onPointerDown={(ev) => controls.start(ev)} />
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
            <p className="text-gray-400 w-10 text-center"> {index + 1}</p>
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
                // onReorder={handleVideoReorder}
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
    </motion.article>
  );
};

const Video = ({
  video,
  onClick,
  onReorder,
}: {
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onClick?: () => void;
  video: Video;
}) => {
  const fetcher = useFetcher();
  const controls = useDragControls();

  const handleDragEnd = (event: MouseEvent) => {
    const all = document.elementsFromPoint(event.clientX, event.clientY);
    const found = all.find(
      (node) =>
        node.dataset.videoindex &&
        node.dataset.videoindex !== String(video.index)
    );
    if (found) {
      // update parent?? nah! lets update the db directly
      onReorder?.(Number(video.index), Number(found.dataset.videoindex));
      // @todo do we really want to do this here?
      fetcher.submit(
        {
          intent: "update_video",
          data: JSON.stringify([{}]),
        },
        { method: "POST" }
      );
    }
  };

  return (
    <motion.div
      data-videoindex={video.index}
      onDragEnd={handleDragEnd}
      dragListener={false}
      drag
      dragControls={controls}
      dragSnapToOrigin
      onClick={onClick}
      className={cn(
        "hover:scale-[1.02] text-left py-1 px-4 rounded",
        // video.isPublic ? "bg-green-500" : "bg-slate-400",
        "bg-slate-400",
        "flex gap-2"
      )}
    >
      <Dragger onPointerDown={(event) => controls.start(event)} />
      <p className="truncate">{video.title}</p>
      <div className="ml-auto flex gap-2 items-center">
        {video.isPublic && <span>🌎</span>}
        <span>{video.storageKey ? "📼" : "🫥"}</span>
        {[...new Set(video.m3u8 || [])].map((version) => (
          <span
            className="text-xs text-white bg-blue-500 py-px px-2 rounded-full"
            key={version}
          >
            {version}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const Dragger = ({
  onPointerDown,
}: {
  onPointerDown?: (arg0?: unknown) => void;
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
