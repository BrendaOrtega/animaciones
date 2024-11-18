import { Link } from "@remix-run/react";
import { NavBar } from "~/components/NavBar";
import { PrimaryButton } from "~/components/PrimaryButton";
import { cn } from "~/lib/utils";

export default function Route() {
  return (
    <article className="flex flex-col items-center h-screen justify-center gap-4 ">
      <NavBar />
      <h2 className="text-4xl font-semibold">
        Comparte este súper descuento con tus amigos 💪🏻
      </h2>
      <div className="flex relative w-full md:w-[480px] gap-2 h-16 rounded-full border border-lightGray  ">
        <input
          name="email"
          type="email"
          placeholder="brendi@ejemplo.com"
          className={cn(
            " py-2 px-6 w-full h-full bg-transparent rounded-full border-none focus:border-none focus:ring-indigo-500"
          )}
        />
        <button
          type="submit"
          className={cn(
            "absolute right-0 h-full not-disabled:hover:bg-indigo-600 rounded-full bg-indigo-500  py-2 px-2 md:px-6 text-white not-disabled:active:scale-95 disabled:cursor-not-allowed w-[180px] md:w-[220px] flex justify-center items-center"
          )}
        >
          Enviar magic link 🪄
        </button>
      </div>
      <Link to="/portal">
        <PrimaryButton>Solicitar uno nuevo</PrimaryButton>
      </Link>
    </article>
  );
}
