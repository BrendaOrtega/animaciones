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
    <Switch
      checked={enabled}
      onChange={toggle}
      className="group inline-flex h-8 w-[52px] items-center rounded-full bg-[#F6F6F6] transition data-[checked]:bg-[#242424] "
    >
      <span className="size-4 h-6 w-6 dark:bg-[url('/moon.svg')] translate-x-1 rounded-full bg-[url('/sun.svg')] bg-cover  bg-white transition group-data-[checked]:translate-x-6" />
    </Switch>
  );
};
