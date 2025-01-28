import { cn } from "~/lib/utils";

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
