import { Switch } from "@headlessui/react";
import { useState } from "react";

export const ToggleButton = () => {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    const val = !enabled;
    // const main = document.querySelector("#main");
    const main = document.documentElement;
    if (val) {
      main?.classList.add("dark");
    } else {
      main?.classList.remove("dark");
    }
    setEnabled(val);
  };

  return (
    <label
      htmlFor="check"
      className="bg-lightGray dark:bg-[#242424] px-1 py-1 w-[52px] rounded-full transition-all has-[checked]:pl-6 "
    >
      <div className="size-4 w-6 h-6 dark:bg-[url('/moon.svg')] translate-x-0 rounded-full bg-[url('/sun.svg')] bg-cover  bg-white transition dark:translate-x-5 group-data-[checked]:translate-x-5"></div>
      <input onChange={toggle} id="check" type="checkbox" className="hidden" />
    </label>
  );
};
