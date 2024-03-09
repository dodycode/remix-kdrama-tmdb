import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

import { NextUIProvider } from "@nextui-org/react";

import "./tailwind.css";
import Header from "./components/header";

import {
  ThemeSwitcherSafeHTML,
  ThemeSwitcherScript,
} from "./lib/theme-switcher";
import { LoadingIndicator } from "./components/loading-indicator";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeSwitcherSafeHTML lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeSwitcherScript />
      </head>
      <body>
        <LoadingIndicator />
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </ThemeSwitcherSafeHTML>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    status = error.status;
    switch (error.status) {
      case 404:
        message = "Page Not Found";
        break;
    }
  } else {
    console.error(error);
  }

  return (
    <NextUIProvider>
      <div className="container prose py-8">
        <h1>{status}</h1>
        <p>{message}</p>
      </div>
    </NextUIProvider>
  );
}

export default function App() {
  return (
    <NextUIProvider>
      <Outlet />
    </NextUIProvider>
  );
}
