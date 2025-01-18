import type { Video } from "@prisma/client";
import { type ChangeEvent, Ref, SyntheticEvent, useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { cn } from "~/lib/utils";
import { useUploadMultipart } from "react-hook-multipart/react";
import { UseFormSetValue } from "react-hook-form";
import { handler } from "react-hook-multipart";
// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { toBlobURL } from "@ffmpeg/util"; @TODO Try use ffmpg in the browser! (WASM) 🤓
export const VideoFileInput = ({
  video,
  setValue,
  label,
  name,
  register,
  className,
  onVideoLoads,
}: {
  onVideoLoads?: (
    arg0: Ref<HTMLVideoElement>,
    arg1: SyntheticEvent<HTMLVideoElement, Event>
  ) => void;
  className?: string;
  register?: any;
  label?: string;
  name: string;
  setValue: UseFormSetValue<Partial<Video> | any>;
  video: Partial<Video>;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>(video.storageLink || "");
  const [uploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelection = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files?.length) return;

    const file = e.currentTarget.files[0] as File;
    if (
      "type" in file &&
      (file.type === "video/mp4" || file.type === "video/quicktime")
    ) {
      setVideoSrc(URL.createObjectURL(file)); // create preview stream from file
      uploadFileHandler(file); // upload handler
    } else {
      return console.error("No file selected");
    }
  };

  // multipart stuff
  const { upload } = useUploadMultipart({
    handler: "/api/upload/" + video.id,
    onUploadProgress: ({ percentage }: { percentage: number }) =>
      setProgress(percentage),
  });
  const uploadFileHandler = async (file: File) => {
    setIsUploading(true);
    const { key } = await upload("animaciones/video-", file);
    const modKey = key.replace("animaciones/", ""); // weird hack for this course 🥲
    // this is mere formality, the model is already updated on the action
    setValue("storageKey", modKey);
    setValue("storageLink", "/files?storageKey=" + modKey);
    setIsUploading(false);
  };

  return (
    <section
      className={cn("my-2 grid gap-2 max-w-[50vw] md:max-w-[30vw]", className)}
    >
      <p>{label}</p>
      <input
        type="text"
        name={name}
        className="disabled:pointer-events-none rounded-lg disabled:text-gray-500 disabled:bg-gray-200"
        disabled
        {...register(name)}
      />
      <input
        type="file"
        onChange={handleFileSelection}
        accept="video/mp4,video/x-m4v,video/*"
        className="mb-2"
      />{" "}
      {uploading && (
        <div className="flex gap-2">
          <Spinner />{" "}
          <span>
            Subiendo video {progress.toFixed(0)}% no cierre la ventana
          </span>
        </div>
      )}
      {videoSrc && (
        <video
          onCanPlay={(event) => onVideoLoads?.(videoRef, event)} // shulada 🥰
          ref={videoRef}
          src={videoSrc}
          className="border rounded-xl my-2 aspect-video w-full"
          controls
        ></video>
      )}
    </section>
  );
};
