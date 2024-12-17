import { useFetcher } from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { action } from "~/routes/admin";

export const ImageInput = ({
  label,
  storageKey,
  setValue,
  name,
  defaultValue,
  register,
  className,
  ...props
}: {
  className?: string;
  register: any;
  defaultValue?: string | null;
  name: string;
  setValue?: (a: any, b: any) => void;
  storageKey: string;
  label?: string;
  [x: string]: any;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [urls, setUrls] = useState({});
  const fetcher = useFetcher<typeof action>();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget?.files?.[0];
    if (!file) return console.error("No file selected");
    // generate preview
    const url = URL.createObjectURL(file);
    setPreview(url); // @todo change position through drag
    // upload image? YES
    await fetch(urls.putURL, {
      method: "PUT",
      body: file,
      headers: {
        "content-type": file.type,
        "content-size": file.size,
      },
    }).catch((e) => console.error(e));
    // update model? YES
    setValue?.(name, "/files?storageKey=" + storageKey);
  };

  const getStorageKey = () => {
    fetcher.submit(
      {
        intent: "get_combo_urls",
        storageKey,
      },
      { method: "POST" }
    );
  };

  // urls request
  useEffect(() => {
    if (fetcher.data) {
      setUrls(fetcher.data);
    } else {
      getStorageKey();
    }
  }, [fetcher.data]);

  const src = preview || defaultValue;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreview(e.currentTarget.value);
  };

  return (
    <>
      <section className={cn("max-w-[30vw]", className)}>
        <p className="">{label}</p>
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          className="my-2 w-full rounded-lg disabled:bg-gray-200 text-gray-500"
          {...register(name)}
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={() => {
            inputRef.current?.click();
          }}
          className={cn(
            "border-indigo-500 border-2 rounded-3xl border-dotted flex items-center justify-center text-indigo-500 cursor-pointer text-lg hover:text-xl transition-all w-full aspect-video",
            {
              "border-none": src,
            }
          )}
        >
          {!src && <h2>Selecciona un archivo 📂 </h2>}
          {src && (
            <img
              className="object-cover w-full aspect-video rounded-3xl"
              src={src}
              alt="preview"
            />
          )}
        </button>

        <input
          onChange={handleChange}
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
        />
      </section>
    </>
  );
};
