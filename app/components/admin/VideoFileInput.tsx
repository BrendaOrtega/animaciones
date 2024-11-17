import { type Video } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { action } from "~/routes/admin";

export const VideoFileInput = ({
  video,
  setValue,
}: {
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
    const storageKey = video.id as string; // @todo improve
    // const sk = file.name;
    console.log("pidiendo con: ", storageKey);
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
    updateDuration();
  };

  const updateDuration = () => {
    const duration = videoRef.current ? videoRef.current.duration : 0;
    setValue?.("duration", duration);
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
      setValue("storageLink", "/videos?storageKey=" + storageKey);
      setValue("storageKey", storageKey);
      console.info("uploaded with:", storageKey);
    }
  };

  useEffect(() => {
    if (fetcher.data) {
      setURLs({ ...fetcher.data });
    } else {
      getStorageKey();
    }
  }, [fetcher.data]);

  return (
    <section className="my-2">
      <input type="hidden" name="storageKey" value={storageKey} />
      <input
        type="file"
        onChange={handleFileSelection}
        accept="video/*"
        className="mb-2"
      />
      ;
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          className="border rounded-xl my-2 aspect-video"
          controls
        ></video>
      )}
    </section>
  );
};