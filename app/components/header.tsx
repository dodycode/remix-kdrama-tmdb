import React from "react";
import {
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Switch,
} from "@nextui-org/react";

import { MoonIcon, SunIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getTheme, toggleTheme } from "~/lib/theme-switcher";

import { useHydrated } from "remix-utils/use-hydrated";

const ThemeSwitcher = () => {
  const theme = getTheme();

  const isHydrated = useHydrated();

  if (!isHydrated) return <></>;

  return (
    <Switch
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
  return (
    <Navbar
      classNames={{
        wrapper: "w-full md:p-0 md:max-w-5xl",
      }}
      shouldHideOnScroll
    >
      <NavbarBrand>
        <Link href="/" color="foreground">
          <p className="font-bold">KDRAMAFLIX</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="flex-1" justify="center">
        <Input
          classNames={{
            base: "max-w-full h-10",
            mainWrapper: "h-full",
            input: "text-sm",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
          type="search"
          radius="sm"
        />
      </NavbarContent>
      <NavbarContent className="hidden md:flex" justify="end">
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
}
