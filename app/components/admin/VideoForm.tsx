import { type Video } from "@prisma/client";
import { Form, useFetcher } from "@remix-run/react";
import { PrimaryButton } from "~/components/PrimaryButton";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import { ImageInput } from "./ImageInput";
import { VideoFileInput } from "./VideoFileInput";
import { Ref } from "react";

// @todo select moduleName to swap'em
export const VideoForm = ({
  onSubmit,
  video,
  videosLength,
}: {
  videosLength?: number;
  onSubmit?: (arg0: Partial<Video>) => void;
  video: Partial<Video>;
}) => {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  const {
    handleSubmit,
    register,
    formState: { isValid },
    setValue,
  } = useForm({
    defaultValues: {
      storageLink: video.storageLink,
      storageKey: video.storageKey,
      title: video.title || "",
      isPublic: video.isPublic || false,
      duration: video.duration,
      moduleName: video.moduleName,
      id: video.id,
      slug: video.slug,
      index: Number(video.index) || videosLength,
      // @todo remove default
      poster: video.poster,
    },
  });

  // puente para la duración
  const handleVideoLoad = (videoRef: Ref<HTMLVideoElement>) => {
    setValue("duration", String(Number(videoRef.current.duration) / 60));
  };

  const handleSaveVideo = (values: Partial<Video>) => {
    // @todo validate zod
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
    // @todo: delete video file first
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

  const handleGenerateVersions = () => {
    // Kidnaped du an experiment 🚧
    if (!confirm("Esta operación gasta recursos, ¿estás segura de continuar?"))
      return;

    if (!video.id || !video.storageKey)
      return alert("ABORTANDO::No existe video");

    return fetcher.submit(
      {
        intent: "trigger_video_processing",
        storageKey: video.storageKey as string,
      },
      { method: "POST" }
    );
  };

  const data = (fetcher.data as { playListURL: string }) || {
    playListURL: null,
  };

  return (
    <>
      <Form
        className="flex flex-col h-full"
        onSubmit={handleSubmit(handleSaveVideo)}
      >
        <h3 className="mb-2 text-gray-100 text-xl">
          Nombre del modulo: {video.moduleName}
        </h3>
        <h3 className="mb-2 text-gray-400 text-xl"> {video.slug}</h3>

        <TextField
          type="number"
          placeholder="posición en la lista"
          label="Índice"
          register={register("index", { required: true })}
        />
        <TextField
          placeholder="Título del nuevo video"
          label="Título del video"
          register={register("title", { required: true })}
        />
        {video.id && (
          <VideoFileInput
            className="text-white"
            label="Link del video"
            name="storageLink"
            video={video}
            setValue={setValue}
            register={register}
            onVideoLoads={handleVideoLoad}
          />
        )}
        {data.playListURL && (
          <video controls className="aspect-video">
            <source src={data.playListURL} type="application/x-mpegURL" />
          </video>
        )}
        {video.storageKeys && video.storageKeys.length > 0 && (
          <div className="text-white dark:text-black mb-2">
            <p>Otras versiones:</p>
            <div className="flex gap-2">
              {video.m3u8?.map((k) => (
                <p key={k}>{k}</p>
              ))}
            </div>
          </div>
        )}
        {video.storageKey && (
          <button
            onClick={handleGenerateVersions}
            type="button"
            className="dark:text-black text-white border rounded-md py-2 active:bg-gray-800 mb-4"
          >
            Generar Todas las Versiones
          </button>
        )}

        {video.id && (
          <>
            <label className="flex justify-between cursor-pointer my-4 text-white">
              <span>¿Este video es público?</span>
              <input
                {...register("isPublic")}
                name="isPublic"
                className="size-4 text-green-500"
                type="checkbox"
              />
            </label>

            <TextField
              placeholder="60"
              type="text"
              label="Duración del video en minutos"
              register={register("duration", { required: false })}
            />
          </>
        )}
        {/* No borrar, puede volver, debería */}
        {video.id && (
          <ImageInput
            className="text-white"
            setValue={setValue}
            defaultValue={video.poster}
            name="poster"
            storageKey={"poster-" + video.id}
            label="Link del poster"
            register={register}
          />
        )}
        <div className="flex gap-2 pt-4 sticky bottom-0 bg-black">
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

export const TextField = ({
  error,
  name,
  label,
  placeholder,
  register,
  isDisabled,
  type = "text",
  ...props
}: {
  type?: "text" | "number";
  isDisabled?: boolean;
  register?: any;
  error?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  [x: string]: any;
}) => {
  return (
    <label className="flex flex-col gap-2 mb-4 text-white">
      <p className="">{label}</p>
      <input
        disabled={isDisabled}
        placeholder={placeholder}
        className={cn(
          "shadow rounded-md py-2 px-4 border w-full",
          "text-black",
          {
            "bg-gray-200 text-gray-500 pointer-events-none": isDisabled,
          }
        )}
        type={type}
        name={name}
        {...props}
        {...register}
      />
      {error && <p>{error}</p>}
    </label>
  );
};
