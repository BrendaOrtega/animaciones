import { Form, useFetcher } from "@remix-run/react";
import { FormEvent } from "react";
import { googleLogin } from "~/lib/firebase";
import { cn } from "~/lib/utils";
import { action } from "~/routes/portal"; // this may change if reuse

export const MagicLink = () => {
  const fetcher = useFetcher<typeof action>();
  const isLoading = fetcher.state !== "idle";
  const error = fetcher.data?.error;
  const success = fetcher.data?.success;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    fetcher.submit(
      {
        intent: "magic_link",
        email: event.currentTarget.email.value,
      },
      { method: "POST" }
    );
  };

  const handleGoogleLogin = async () => {
    const user = await googleLogin();
    const data = {
      displayName: user.displayName,
      email: user.email,
      confirmed: user.emailVerified,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      uid: user.uid,
    };
    fetcher.submit(
      {
        intent: "google_login",
        data: JSON.stringify(data),
      },
      { method: "POST" }
    );
  };

  return (
    <article className="bg-gradient-to-br from-indigo-900 to-gray-950 h-screen flex items-center justify-center flex-col gap-2">
      {!success && (
        <Form onSubmit={onSubmit} method="POST">
          <button
            disabled={isLoading}
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex justify-center bg-green-400 rounded-3xl my-2 p-2 items-center hover:scale-105 transition-all active:scale-100 hover:shadow disabled:pointer-events-none"
          >
            <img
              className="w-40 object-cover"
              src="https://logos-world.net/wp-content/uploads/2020/11/Gmail-Logo-2013-2020.png"
              alt="gmail logo"
            />
            <h3>Inicia sesión con Google</h3>
          </button>
          <div className="flex w-min gap-2">
            <input
              disabled={isLoading}
              aria-disabled={isLoading}
              name="email"
              type="email"
              placeholder="brendi@gmail.com"
              className={cn(
                "rounded-xl py-2 px-6 shadow focus:border-none focus:outline-none focus:ring-4 focus:ring-indigo-500",
                {
                  "ring-red-500 ring-4": error,
                  "disabled:bg-gray-900": isLoading,
                }
              )}
            />
            {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
            <button
              disabled={isLoading}
              type="submit"
              className={cn(
                "not-disabled:hover:bg-indigo-600 bg-indigo-500 rounded-xl py-2 px-6 text-white not-disabled:active:scale-95 disabled:cursor-not-allowed w-[220px] flex justify-center"
              )}
            >
              {isLoading ? (
                <div className="border-4 border-gray-700 border-t-white rounded-full animate-spin h-6 w-6" />
              ) : (
                " Enviar magic link 🪄"
              )}
            </button>
          </div>
        </Form>
      )}

      {success && (
        <section className="text-white text-lg text-center">
          <p>Ya te hemos enviado el token de acceso a tu cuenta. ✅</p>
          <p>
            Checa tu{" "}
            <a
              rel="noreferrer"
              target="_blank"
              href="http://gmail.com"
              className="text-blue-500 hover:text-blue-400"
            >
              mail.
            </a>{" "}
            (y tu bandeja de spam 😉).
          </p>
        </section>
      )}
    </article>
  );
};
