import { type Video } from "@prisma/client";
import { Form, useFetcher } from "@remix-run/react";
import { PrimaryButton } from "~/components/PrimaryButton";
import { useForm } from "react-hook-form";
import { VideoFileInput } from "~/components/admin/VideoFileInput";
import { cn } from "~/lib/utils";
import { ImageInput } from "./ImageInput";

// @todo select moduleName to swap'em
export const VideoForm = ({
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
  const index =
    video.index === 0 || video.index === "0"
      ? 0
      : Number(video.index) || nextIndex;
  const {
    handleSubmit,
    register,
    formState: { isValid },
    setValue,
  } = useForm({
    defaultValues: {
      storageLink:
        video.storageLink || "/videos?storageKey=" + video.storageKey,
      storageKey: video.storageKey,
      title: video.title || "",
      isPublic: video.isPublic || false,
      duration: video.duration,
      moduleName: video.moduleName,
      id: video.id,
      slug: video.slug,
      index: index,
      // @todo remove default
      poster: video.poster,
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

  return (
    <>
      <Form
        className="flex flex-col h-full"
        onSubmit={handleSubmit(onSubmition)}
      >
        <h3 className="mb-2 text-gray-400 text-xl">
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
            label="Link del video"
            name="storageLink"
            video={video}
            setValue={setValue}
            register={register}
          />
        )}
        {video.id && (
          <ImageInput
            setValue={setValue}
            defaultValue={video.poster}
            name="poster"
            storageKey={"poster-" + video.id}
            label="Link del poster"
            register={register}
          />
        )}

        {video.id && (
          <>
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
              placeholder="60"
              type="text"
              label="Duración del video en minutos"
              register={register("duration", { required: false })}
            />
          </>
        )}
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
    <label className="flex flex-col gap-2 mb-4">
      <p className="">{label}</p>
      <input
        disabled={isDisabled}
        placeholder={placeholder}
        className={cn("shadow rounded-md py-2 px-4 border w-full", {
          "bg-gray-200 text-gray-500 pointer-events-none": isDisabled,
        })}
        type={type}
        name={name}
        {...props}
        {...register}
      />
      {error && <p>{error}</p>}
    </label>
  );
};
