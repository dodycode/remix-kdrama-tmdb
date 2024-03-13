import { Image } from "@nextui-org/react";
import { DividerHorizontalIcon, DotFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import HStack from "~/components/hstack";
import Text from "~/components/text";
import VStack from "~/components/vstack";
import { cn } from "~/lib/cn";
import { computedTheme, getTheme } from "~/lib/theme-switcher";

import type { Movie } from "./movie-list";

const imageBaseURL = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({
  poster_path,
  first_air_date,
  name,
  genre,
}: Movie & { genre: string }) {
  const isHydrated = useHydrated();
  const theme = computedTheme();

  if (!isHydrated) return <></>;

  //image placeholder online

  const posterPath = poster_path
    ? `${imageBaseURL}${poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <VStack
      className={cn(
        "w-full h-full gap-0 cursor-pointer items-start",
        theme === "dark" && "group transition-all duration-300 ease-in-out"
      )}
    >
      <div className="p-1 lg:p-4 lg:scale-105 w-full transition-all duration-300 ease-in-out">
        <Image
          src={posterPath}
          alt={name}
          classNames={{
            img: "h-full w-full object-cover lg:group-hover:scale-125",
            zoomedWrapper:
              "w-full lg:w-[200px] h-[280px] transition-all duration-300 ease-in-out",
            wrapper: "h-[300px] w-full lg:w-[200px] !max-w-full lg:max-w-fit",
          }}
          isBlurred={theme === "dark"}
          isZoomed
          loading="lazy"
        />
      </div>
      <VStack className="gap-y-2 px-4 -translate-y-2 group-hover:text-white transition-all duration-300 ease-in-out">
        <Text
          className={cn(
            "line-clamp-3 text-ellipsis break-words font-bold transition-all duration-300 ease-in-out",
            theme === "dark" && "text-white"
          )}
        >
          {name}
        </Text>
        <HStack className="gap-x-1 items-center">
          <Text className="text-xs font-semibold">{genre}</Text>
          <DotFilledIcon className="w-3 h-3" />
          <Text className="text-xs font-semibold">
            {/* {new Date(first_air_date).getFullYear()} */}
            {/* year month */}
            {new Date(first_air_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
