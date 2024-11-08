import "./App.css";
import React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

export default function App() {
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
