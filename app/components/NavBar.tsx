import { Link } from "@remix-run/react";
import { ToggleButton } from "./ToggleButton";

// @todo show user is logged in?
export const NavBar = () => {
  return (
    <>
      <nav className="fixed h-16  bg-white/40 dark:bg-dark/40 backdrop-blur-md z-[100] w-full  px-6 md:px-[6%] lg:px-0 ">
        <div className="xl:max-w-7xl justify-between items-center h-16 mx-auto flex">
          <img className="h-10" src="/Logo.png" alt="logo" />
          <Link
            prefetch="render"
            to="/portal"
            className="transition-all hover:text-gray-900 text-gray-500 ml-auto mr-4"
          >
            Iniciar sesión
          </Link>
          <ToggleButton />
        </div>
      </nav>
    </>
  );
};
