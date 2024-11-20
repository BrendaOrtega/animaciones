import { ReactNode } from "react";

const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

export const useToast = () => {
  const setInitial = (toast) => {
    toast.style.transition = "all .3s ease";
    toast.style.position = "fixed";
    toast.style.top = "80px";
    toast.style.right = "40px";
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = 0;
  };

  const setAnimate = (toast: HTMLElement) => {
    toast.style.transform = "translateY(0px)";
    toast.style.opacity = "1";
  };

  const setExit = (toast: HTMLElement) => {
    toast.style.transform = "translateY(-20px)";
    toast.style.opacity = "0";
  };

  const success = async ({
    text,
    icon = "✅",
  }: {
    text: ReactNode;
    icon?: ReactNode;
  }) => {
    const toast = document.createElement("section");
    setInitial(toast);
    toast.innerHTML = `
    <div class="p-6 bg-green-200 text-green-800 flex items-end justify-center rounded-2xl" >
    <p class="text-xl"><span>${icon}</span> ${text}</p>
    </div>
    `;
    document.body.appendChild(toast);
    await sleep(0.01);
    setAnimate(toast);
    setTimeout(async () => {
      setExit(toast);
      await sleep(0.3);
      toast.remove();
    }, 3000);
  };
  return {
    success,
  };
};
