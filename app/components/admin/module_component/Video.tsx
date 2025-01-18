import { type Video as VideoType } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { MouseEvent, PointerEvent } from "react";
import { cn } from "~/lib/utils";
import { motion, PanInfo, useDragControls } from "motion/react";
import { Dragger } from "./Dragger";

export const Video = ({
  video,
  onClick,
  onReorder,
}: {
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onClick?: () => void;
  video: VideoType;
}) => {
  const fetcher = useFetcher();
  const controls = useDragControls();

  const handleDragEnd = (event: MouseEvent<HTMLDivElement>, _: PanInfo) => {
    const all = document.elementsFromPoint(
      event.clientX,
      event.clientY
    ) as HTMLElement[];
    const found = all.find(
      (node) =>
        node.dataset.videoindex &&
        node.dataset.videoindex !== String(video.index)
    );
    if (found) {
      onReorder?.(Number(video.index), Number(found.dataset.videoindex));
      // Do we really want to do this here? Yes.
      fetcher.submit(
        {
          intent: "update_video",
          data: JSON.stringify([{}]), // @todo
        },
        { method: "POST" }
      );
    }
  };

  return (
    <motion.div
      data-videoindex={video.index}
      onDragEnd={handleDragEnd as any}
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
      <Dragger
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
          controls.start(event);
        }}
      />
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
