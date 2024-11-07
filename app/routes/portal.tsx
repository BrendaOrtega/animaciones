import { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { PrimaryButton } from "~/components/PrimaryButton";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  // @todo check for purchase token to save cookie
  // validate token, and invalidate it
  // setCookie an eternal one*
  // return handlePurchaseToken(token) // this will redirect
  return null;
};

export default function Route() {
  return (
    <article className="flex flex-col items-center h-screen justify-center gap-4 bg-slate-200">
      <h2 className="text-2xl">Este token no sirve más. 👩🏻‍🔧</h2>
      <Link to="/">
        <PrimaryButton>Volver al inicio</PrimaryButton>
      </Link>
    </article>
  );
}
