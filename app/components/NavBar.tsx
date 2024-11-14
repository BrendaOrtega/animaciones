import { Link, useFetcher } from "@remix-run/react";
import { ToggleButton } from "./ToggleButton";
import { useEffect } from "react";
import { action } from "~/routes/_index";
import { cn } from "~/lib/utils";
import { FaDoorClosed } from "react-icons/fa";

// @todo show user is logged in?
export const NavBar = ({
  mode,
  className,
}: {
  mode?: "player";
  className?: string;
}) => {
  const fetcher = useFetcher<typeof action>();
  useEffect(() => {
    fetcher.submit(
      {
        intent: "self",
      },
      { method: "POST" }
    );
  }, []);
  const userEmail = fetcher.data?.user?.email;

  // sign out
  const handleSignOut = () => {
    fetcher.submit(
      { intent: "sign-out" },
      { method: "DELETE", action: "/portal" }
    );
  };

  return (
    <>
      <nav
        className={cn(
          "fixed h-16  bg-white/40 dark:bg-dark/40 backdrop-blur-md z-[100] w-full  px-6 md:px-[6%] lg:px-0",
          {
            "bg-gray-900": mode === "player",
          },
          className
        )}
      >
        <div className="xl:max-w-7xl justify-between items-center h-16 mx-auto flex">
          <img className="h-10" src="/Logo.png" alt="logo" />
          {mode !== "player" && (
            <>
              <Link
                to="/portal"
                className={cn(
                  "transition-all hover:text-gray-900 text-gray-500 ml-auto mr-4",
                  {
                    "font-bold text-fish/80 hover:text-fish": userEmail,
                  }
                )}
              >
                {userEmail ? "Seguir viendo" : "Iniciar sesión"}
              </Link>
              <ToggleButton />
            </>
          )}
          {mode === "player" && (
            <button
              onClick={handleSignOut}
              className="transition-all hover:scale-105 py-1 px-2 rounded-full text-white text-xl active:scale-100"
            >
              <FaDoorClosed />
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
