import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * This component is used to set the theme based on the value at hydration time.
 * If no value is found, it will default to the user's system preference and
 * coordinates with the ThemeSwitcherScript to prevent a flash of unstyled content
 * and a React hydration mismatch.
 */
export function ThemeSwitcherSafeHTML({
  children,
  lang,
  ...props
}: React.HTMLProps<HTMLHtmlElement> & { lang: string }) {
  const dataTheme =
    typeof document === "undefined"
      ? "light"
      : document.documentElement.getAttribute("data-theme") || "light";

  return (
    <html {...props} lang={lang} data-theme={dataTheme}>
      {children}
    </html>
  );
}

/**
 * This script will run on the client to set the theme based on the value in
 * localStorage. If no value is found, it will default to the user's system
 * preference.
 *
 * IMPORTANT: This script should be placed at the end of the <head> tag to
 * prevent a flash of unstyled content.
 */
export function ThemeSwitcherScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var theme = localStorage.getItem("theme");
            if (theme) {
              document.documentElement.setAttribute("data-theme", theme);
            }
          })();
        `,
      }}
    />
  );
}

export function getTheme() {
  return validateTheme(
    typeof document === "undefined" ? "light" : localStorage.getItem("theme")
  );
}

/**
 * This function will toggle the theme between light and dark and store the
 * value in localStorage.
 */
export function toggleTheme() {
  if (typeof document === "undefined") return;

  let currentTheme = validateTheme(localStorage.getItem("theme"));
  const newTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
}

export function setTheme(theme: Theme | string) {
  let themeToSet: Theme | null = validateTheme(theme);
  if (themeToSet) {
    localStorage.setItem("theme", themeToSet);
    document.documentElement.setAttribute("data-theme", themeToSet);
  } else {
    localStorage.removeItem("theme");
    document.documentElement.removeAttribute("data-theme");
  }
}

function validateTheme(theme: string | null): Theme {
  return theme === "light" || theme === "dark" ? theme : "light";
}
