import { type Course, type Video } from "@prisma/client";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { FormEvent, useState } from "react";
import { db } from "~/.server/db";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getUserOrRedirect } from "~/.server/user";
import { LayoutGroup } from "motion/react";
import {
  createVersionDetached,
  generateVersion,
} from "~/.server/machines_experiment";
import { VIDEO_SIZE } from "~/.server/videoProcessing";
import { Module } from "~/components/admin/module_component/Module";
import { VideoFormDrawer } from "~/components/admin/module_component/VideoFormDrawer";
import { PrimaryButton } from "~/components/PrimaryButton";
import { updateVideoSchema } from "~/lib/zod";
import { removeFilesFor } from "~/.server/removeFilesFor";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const url = new URL(request.url);
  const storageKey = String(formData.get("storageKey"));

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

  if (intent === "generate_video_version") {
    // @todo if processes for this size active, avoid.
    console.info("INSIDE_WORKER_PERFORMANCE_MACHINE");
    generateVersion({
      machineId: url.searchParams.get("machineId") as string,
      size: url.searchParams.get("size") as VIDEO_SIZE,
      storageKey,
    });
  }

  if (intent === "trigger_video_processing") {
    await createVersionDetached(storageKey, "360p");
    await createVersionDetached(storageKey, "480p");
    await createVersionDetached(storageKey, "720p");
    await createVersionDetached(storageKey, "1080p");
    return json(null, { status: 200 });
  }
  // DEPRECATED
  if (intent === "get_combo_urls") {
    const storageKey = String(formData.get("storageKey"));
    return null;
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
    if (!data.id) throw new Response("Video not found", { status: 404 });

    data.courseIds = ["645d3dbd668b73b34443789c"]; // forcing this course
    const {
      data: validData,
      success,
      error,
    } = updateVideoSchema.safeParse(data); // @todo finish it
    !success && console.error("FALLÓ::", error?.issues);
    if (!success) throw new Response({ errors: error.issues }, { status: 400 });

    validData.storageLink ??= "/videos?storageKey=" + validData.storageKey; // experiment
    return await db.video.update({
      where: {
        id: validData.id,
      },
      data: { ...validData, id: undefined },
    });
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
  const moduleNamesOrder = (
    course.moduleNamesOrder.length
      ? [...course.moduleNamesOrder].filter(Boolean)
      : [...new Set(videos.filter(Boolean).map((video) => video.moduleName))]
  ) as string[];
  return { course, videos, moduleNamesOrder };
};

const initialVideo = {
  title: "Nuevo video",
  moduleName: "",
};
export default function Page() {
  const fetcher = useFetcher();
  const { course, moduleNamesOrder, videos } = useLoaderData<typeof loader>();
  const [video, setVideo] = useState<Partial<Video>>(initialVideo);
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);
  const [modules, setModules] = useState<string[]>(moduleNamesOrder);

  const handleNewModuleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements = new FormData(e.currentTarget);
    const name = String(elements.get("name"));
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
    // @todo update all videos? No, better update just the course property. <-- revisit and confirm
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
      {/* Form drawer */}
      <VideoFormDrawer
        setShowVideoDrawer={setShowVideoDrawer}
        setVideo={setVideo}
        showVideoDrawer={showVideoDrawer}
        video={video}
        initialVideo={initialVideo}
        videos={videos}
      />

      {/* Main page */}
      <article className="bg-gradient-to-tr from-slate-950 to-indigo-950 min-h-screen py-20 px-8">
        <Header course={course} onSubmit={handleNewModuleNameSubmit} />
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
                // videos manage themselves (that's why the are hidden inside Module, maybe add more compistion in the future?)
              />
            ))}
          </section>
        </LayoutGroup>
      </article>
    </>
  );
}

const Header = ({
  course,
  onSubmit,
}: {
  course: Course;
  onSubmit: (arg0: FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <>
      <h1 className="text-gray-50 text-2xl mb-6">{course.title}</h1>
      <form onSubmit={onSubmit} className="flex items-center justify-end gap-4">
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
    </>
  );
};
