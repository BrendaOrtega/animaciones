import "./App.css";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css";
import useGoogleTM from "./lib/useGoogleTM";
import useHotjar from "./lib/useHotjar";

export const links = () => {
  return [
    {
      rel: "icon",
      href: "/icon.svg",
      type: "image/svg",
    },
  ];
};

export default function App() {
  useGoogleTM();
  useHotjar();
  return (
    <>
      <html suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body suppressHydrationWarning>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html>
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
            }}
          >
            <div>
              <img style={{ width: "180px" }} src="/404.svg" />
              <h1 style={{ fontFamily: "monospace" }}>
                Ups ¡Esta página no existe!
              </h1>
              <a href="/">
                <button
                  style={{
                    height: "48px",
                    borderRadius: "24px",
                    backgroundColor: "#5158F6",
                    padding: "0 16px",
                    color: "white",
                    border: "none",
                    marginTop: "32px",
                    cursor: "pointer",
                  }}
                >
                  Volver a la página principal
                </button>
              </a>
            </div>
          </div>
        </body>
      </html>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>como estan</h1>
        <p>hola{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
