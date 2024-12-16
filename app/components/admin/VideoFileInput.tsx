import { type Video } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { action } from "~/routes/admin";
import { Spinner } from "../Spinner";
import { cn } from "~/lib/utils";

// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { toBlobURL } from "@ffmpeg/util"; @TODO experiment

export const VideoFileInput = ({
  video,
  setValue,
  label,
  name,
  register,
  className,
  onVideoLoads,
}: {
  onVideoLoads?: () => void;
  className?: string;
  register?: any;
  label?: string;
  name: string;
  setValue: (arg0: string, arg2: string | number) => void;
  video: Partial<Video>;
}) => {
  const [urls, setURLs] = useState<{
    putURL: string;
    readURL: string;
    deleteURL: string;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fetcher = useFetcher<typeof action>();
  const [videoSrc, setVideoSrc] = useState<string>(video.storageLink || "");
  const [storageKey, setStorageKey] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  // @todo: calculate progress 🤩
  const updateProgres = () => {
    new TransformStream({
      transform() {},
      flush() {},
    });
  };

  const getStorageKey = () => {
    const storageKey = "video-" + video.id; // @todo improve
    fetcher.submit(
      {
        intent: "get_combo_urls",
        storageKey,
      },
      { method: "POST" }
    );
    setStorageKey(storageKey);
    return storageKey;
  };

  const handleFileSelection = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return console.error("No file selected");
    setVideoSrc(URL.createObjectURL(file)); // create preview stream from file
    uploadFile(file); // upload
  };

  const uploadFile = async (file: File) => {
    // @todo: catch progress
    if (!file || !urls) return console.error("No file, nor urls present");

    if (urls.putURL) {
      setUploading(true);
      await fetch(urls.putURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Length": file.size,
          "Content-Type": file.type,
        },
      })
        .catch((e) => {
          setUploading(false);
          console.error(e);
        })
        .then(() => setUploading(false));
      //@todo improve
      setValue("storageKey", storageKey);
      setValue("storageLink", "/files?storageKey=" + storageKey);
    }
  };

  useEffect(() => {
    // @todo why?
    if (fetcher.data) {
      setURLs({ ...fetcher.data });
    } else {
      getStorageKey();
    }
  }, [fetcher.data]);

  //@todo revisit max-w
  return (
    <section className={cn("my-2 grid gap-2 max-w-[50vw]", className)}>
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
        accept="video/*"
        className="mb-2"
      />{" "}
      {uploading && (
        <div className="flex gap-2">
          <Spinner /> Subiendo video, no cierre la ventana
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
