import { type Video } from "@prisma/client";
import { Form, json, useFetcher, useLoaderData } from "@remix-run/react";
import { FormEvent, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { db } from "~/.server/db";
import { PrimaryButton } from "~/components/PrimaryButton";
import { Drawer } from "~/components/SimpleDrawer";
import { useForm } from "react-hook-form";
import { ActionFunctionArgs } from "@remix-run/node";
import { useClickOutside } from "~/hooks/useClickOutside";
import slugify from "slugify";
import { cn } from "~/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete_video") {
    const id = String(formData.get("videoId"));
    await db.video.delete({ where: { id } });
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
    // if exists
    if (data.id) {
      const id = data.id;
      delete data.id; // improve
      await db.video.update({
        where: {
          id,
        },
        data,
      });
      return null;
    }
    await db.video.create({ data });
  }
  return null;
};

export const loader = async () => {
  const course = await db.course.findUnique({
    where: { id: "645d3dbd668b73b34443789c" },
  });
  const videos = await db.video.findMany({
    where: {
      courseIds: {
        has: "645d3dbd668b73b34443789c",
      },
    },
  });
  if (!course) throw json(null, { status: 404 });
  const moduleNames = [...new Set(videos.map((video) => video.moduleName))];
  return { course, videos, moduleNames };
};

export default function Route() {
  const { course, moduleNames, videos } = useLoaderData<typeof loader>();
  const [video, setVideo] = useState<Partial<Video>>({
    title: "Nuevo video",
    moduleName: "",
  });
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
      <article className="bg-gradient-to-tr from-slate-950 to-indigo-950 h-screen py-20 px-8">
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
        <section className="my-8">
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
        title="Añadir video"
        cta={<></>} // remove cancel button
      >
        <VideoForm
          nextIndex={videos.length}
          onSubmit={() => setShowVideoDrawer(false)}
          video={video}
        />
      </Drawer>
    </>
  );
}

// @todo select moduleName to swap'em
const VideoForm = ({
  onSubmit,
  video,
  nextIndex,
}: {
  nextIndex: number;
  onSubmit?: (arg0?: Partial<Video>) => void;
  video: Partial<Video>;
}) => {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: video.title || "",
      isPublic: video.isPublic || false,
      storageLink: video.storageLink || "",
      duration: video.duration || "30",
      moduleName: video.moduleName,
      id: video.id,
      slug: video.slug,
      index: String(video.index === 0 ? "0" : video.index || nextIndex),
      // @todo remove default
      poster: video.poster || "https://i.imgur.com/GdtxiE9.png",
    },
  });

  const onSubmition = (values: Partial<Video>) => {
    fetcher.submit(
      {
        intent: "update_video",
        data: JSON.stringify(values),
      },
      { method: "POST" }
    );
    onSubmit?.(values);
  };

  const handleDelete = () => {
    if (!confirm("¿Seguro que quieres elminar?") || !video.id) return;
    fetcher.submit(
      {
        intent: "delete_video",
        videoId: video.id,
      },
      { method: "POST" }
    );
    onSubmit?.();
  };

  return (
    <>
      <Form
        className="flex flex-col h-full"
        onSubmit={handleSubmit(onSubmition)}
      >
        <h3 className="mb-2 text-gray-400 text-xl">
          Módulo: {video.moduleName}
        </h3>
        <h3 className="mb-2 text-gray-400 text-xl">Slug: {video.slug}</h3>

        <TextField
          type="number"
          placeholder="lugar en la lista: 0"
          label="Índice de orden"
          register={register("index", { required: true })}
        />
        <TextField
          placeholder="Título del nuevo video"
          label="Título del video"
          register={register("title", { required: true })}
        />
        <TextField
          defaultValue="https://firebasestorage.googleapis.com/v0/b/fixter-67253.appspot.com/o/fixtergeek.com%2Fmicro-cursos%2Fintrocss%2F1_boxModel.mov?alt=media&token=54cc5e8a-0f90-4df8-9c98-cedfeef6c765"
          placeholder="link del video"
          label="Fuente del video"
          register={register("storageLink", { required: true })}
        />

        <TextField
          placeholder="poster del video"
          label="Poster del video"
          register={register("poster", { required: false })}
        />

        <label className="flex justify-between cursor-pointer my-4">
          <span>¿Este video es público?</span>
          <input
            {...register("isPublic")}
            name="isPublic"
            className="size-4"
            type="checkbox"
          />
        </label>
        <TextField
          defaultValue={10}
          placeholder="60"
          label="Duración del video en minutos"
          register={register("duration", { required: true })}
        />
        <div className="flex mt-auto gap-4">
          <PrimaryButton
            isDisabled={!isValid || isLoading}
            className="w-full"
            type="submit"
          >
            Guardar
          </PrimaryButton>
          {video.id && (
            <PrimaryButton
              onClick={handleDelete}
              className="w-full bg-red-500"
              type="button"
            >
              Eliminar
            </PrimaryButton>
          )}
        </div>
      </Form>
    </>
  );
};

const TextField = ({
  error,
  name,
  label,
  placeholder,
  register,
  ...props
}: {
  register?: any;
  error?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  [x: string]: any;
}) => {
  return (
    <label className="flex flex-col gap-2 mb-4">
      <p className="">{label}</p>
      <input
        placeholder={placeholder}
        className="shadow rounded-md py-2 px-4 border w-full"
        type="text"
        name={name}
        {...props}
        {...register}
      />
      {error && <p>{error}</p>}
    </label>
  );
};

const Module = ({
  title,
  videos = [],
  onAddVideo,
  onVideoSelect,
  onModuleTitleUpdate,
}: {
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

  const toggleEditTitle = () => {
    setIsEditing((i) => !i);
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
    <>
      <section className="bg-slate-600 py-2 px-4 flex justify-between items-center mt-2">
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
          <button
            onClick={() => setIsEditing(true)}
            className="text-white font-bold capitalize text-left"
          >
            {title ? title : "Sin título"}
          </button>
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
          {videos.map((video, index) => (
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
    </>
  );
};

const Video = ({ video, onClick }: { onClick?: () => void; video: Video }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "transition-all hover:scale-[1.02] text-left py-1 px-4 rounded",
        video.isPublic ? "bg-green-500" : "bg-slate-400"
      )}
    >
      <p>{video.title}</p>
    </button>
  );
};
