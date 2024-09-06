import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "@remix-run/react";

import { NextUIProvider } from "@nextui-org/react";

import "./root.css";

import Header from "./components/header";

import {
  ThemeSwitcherSafeHTML,
  ThemeSwitcherScript,
} from "./lib/theme-switcher";
import LoadingIndicator from "./components/loading-indicator";
import { Footer } from "./components/footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeSwitcherSafeHTML lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=1" />
        <link rel="sitemap" href="/sitemap.xml" />
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

        <Footer />
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
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <Outlet />
    </NextUIProvider>
  );
}
