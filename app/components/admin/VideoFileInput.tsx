import { type Video } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { action } from "~/routes/admin";

export const VideoFileInput = ({
  video,
  setValue,
  label,
  name,
  register,
}: {
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
  // const fileRef = useRef<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(video.storageLink || "");
  const [storageKey, setStorageKey] = useState<string>("");

  // @todo: calculate progress 🤩
  const updateProgres = () => {
    new TransformStream({
      transform() {},
      flush() {},
    });
  };

  const getStorageKey = () => {
    const storageKey = "video-" + video.id; // @todo improve
    // const sk = file.name;

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
    // fileRef.current = file; // saving file
    setVideoSrc(URL.createObjectURL(file)); // create preview stream from file
    // const extension = file.name.split(".")[file.name.split(".").length - 1];
    uploadFile(file); // upload
  };

  const updateDuration = () => {
    const duration = videoRef.current?.duration;
    setValue?.("duration", Number(duration).toFixed(0));
  };

  const uploadFile = async (file: File) => {
    // @todo: catch progress
    if (!file || !urls) return console.error("No file, nor urls present");
    if (urls.putURL) {
      await fetch(urls.putURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Length": file.size,
          "Content-Type": file.type,
        },
      }).catch((e) => console.error(e));
      // improve
      setValue("storageKey", storageKey);
      setValue("storageLink", "/files?storageKey=" + storageKey);
      updateDuration();
    }
  };

  useEffect(() => {
    if (fetcher.data) {
      setURLs({ ...fetcher.data });
      updateDuration();
    } else {
      getStorageKey();
    }
  }, [fetcher.data]);

  return (
    <section className="my-2 grid gap-2">
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
      />

      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          className="border rounded-xl my-2 aspect-video w-full"
          controls
        ></video>
      )}
    </section>
  );
};
