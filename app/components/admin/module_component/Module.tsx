import { type Video as VideoType } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { FormEvent, useState } from "react";
import { useClickOutside } from "~/hooks/useClickOutside";
import { PrimaryButton } from "~/components/PrimaryButton";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, useDragControls } from "motion/react";
import { Dragger } from "./Dragger";
import { Video } from "./Video";

export const Module = ({
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
  onVideoSelect?: (arg0: Partial<VideoType>) => void;
  onAddVideo?: (arg0?: string) => void;
  videos: VideoType[];
  title: string;
}) => {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useClickOutside<HTMLFormElement>({
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

  const handleModuleTitleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = form.get("title");
    if (!value) return;

    onModuleTitleUpdate?.(title, value);
    fetcher.submit(
      {
        intent: "update_modulename",
        oldModuleName: title as string,
        newModuleName: value as string,
      },
      { method: "post" }
    );
  };
  const controls = useDragControls();

  const handleDragEnd = (event: PointerEvent) => {
    const all = document.elementsFromPoint(
      event.clientX,
      event.clientY
    ) as HTMLElement[];
    const found = all.find(
      (node: HTMLElement) =>
        node.dataset.index && node.dataset.index !== String(index)
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
