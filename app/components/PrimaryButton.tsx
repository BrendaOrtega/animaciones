import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const PrimaryButton = ({
  className,
  children,
  isDisabled,
  isLoading,
  ...props
}: {
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
  [x: string]: any;
}) => {
  return (
    <button
      disabled={isDisabled}
      {...props}
      className={twMerge(
        "rounded-full hover:scale-95 transition-all bg-fish text-base md:text-lg text-white h-12 md:h-14 px-6 flex gap-2 items-center justify-center font-light ",
        "disabled:bg-slate-300",
        className
      )}
    >
      {!isLoading && children}
      {isLoading && (
        <div className="w-6 h-6 rounded-full animate-spin border-4 border-t-indigo-500" />
      )}
    </button>
  );
};
