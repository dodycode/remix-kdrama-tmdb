import { Navbar, NavbarBrand, NavbarContent, Switch } from "@nextui-org/react";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { getTheme, toggleTheme } from "~/lib/theme-switcher";
import { Link } from "@remix-run/react";

import { useHydrated } from "remix-utils/use-hydrated";
import DebouncedSearch from "./debounced-search";
import { useScrollDirection } from "~/hooks/use-scroll-direction";

export const ThemeSwitcher = () => {
  const theme = getTheme();

  const isHydrated = useHydrated();

  if (!isHydrated) return <></>;

  return (
    <Switch
      classNames={{
        wrapper: "px-0 mr-0",
      }}
      defaultSelected={theme === "light"}
      onChange={() => toggleTheme()}
      aria-label="Toggle theme"
      size="lg"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    />
  );
};

export default function Header() {
  const scrollDirection = useScrollDirection();

  const getNavbarClasses = () => {
    const baseClasses =
      "transform transition-transform duration-300 ease-in-out fixed top-0";
    if (scrollDirection === "down") {
      return `${baseClasses} -translate-y-full`;
    } else {
      return `${baseClasses} translate-y-0`;
    }
  };

  return (
    <>
      {/* This is an invisible div with relative position so that it takes up the height of the menu (because menu is absolute/fixed) */}
      <div className="relative w-full h-[64px] opacity-0 pointer-events-none"></div>
      <Navbar
        classNames={{
          wrapper: "w-full max-w-[895px] lg:p-0",
          base: getNavbarClasses(),
        }}
      >
        <NavbarBrand>
          <Link to="/" unstable_viewTransition>
            <p className="font-bold">KDRAMADB</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="flex-1" justify="center">
          <DebouncedSearch />
        </NavbarContent>
        <NavbarContent className="hidden md:flex" justify="end">
          <ThemeSwitcher />
        </NavbarContent>
      </Navbar>
    </>
  );
}
