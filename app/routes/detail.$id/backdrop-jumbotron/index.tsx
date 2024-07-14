import { Suspense, useEffect } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import HStack from "~/components/hstack";
import JumbotronPoster from "./poster";
import { Await } from "@remix-run/react";
import { Skeleton } from "@nextui-org/react";
import MovieTitle from "./movie-title";
import Text from "~/components/text";
import VStack from "~/components/vstack";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/cn";
import type { FastAverageColorRgba } from "fast-average-color";

const backdropBaseURL = "https://image.tmdb.org/t/p/w1280";

type BackdropJumbotron = {
  kdrama: any;
  bgDominantColor: FastAverageColorRgba;
  bgColorIsLight: boolean;
};

export default function BackdropJumbotron({
  kdrama,
  bgDominantColor,
  bgColorIsLight,
}: BackdropJumbotron) {
  const isHydrated = useHydrated();

  const [r, g, b] = bgDominantColor ?? [0, 0, 0];

  if (!isHydrated) return <></>;

  return (
    <div
      className="w-full bg-auto bg-no-repeat bg-center rounded-3xl overflow-hidden"
      style={{
        backgroundImage: kdrama
          ? `url(${backdropBaseURL}${kdrama?.backdrop_path})`
          : "none",
        boxShadow: `0 25px 50px -12px rgb(${r},${g},${b})`,
      }}
    >
      <div
        className="p-12 backdrop-blur"
        style={{
          background: bgDominantColor
            ? `rgba(${[r, g, b, 0.7]})`
            : `rgba(${[0, 0, 0, 0.7]})`,
        }}
      >
        <HStack className="gap-8">
          <JumbotronPoster kdrama={kdrama} />

          <VStack
            className={cn("py-4 gap-2 flex-1", {
              "backdrop-foreground-light": !bgColorIsLight,
              "backdrop-foreground-dark": bgColorIsLight,
            })}
          >
            <Suspense
              fallback={
                <Skeleton className="rounded-2xl">
                  <div className="h-[384px] !bg-transparent"></div>
                </Skeleton>
              }
            >
              <Await resolve={kdrama}>
                {(kdrama) => <MovieTitle {...kdrama} />}
              </Await>
            </Suspense>

            <VStack className="gap-8">
              <HStack className="gap-2 items-center">
                <Text>{kdrama.first_air_date}</Text>
                <DotFilledIcon className="w-4 h-4" />
                {kdrama.genres.map((genre: any, index: number) => (
                  <Text key={genre.id}>
                    {genre.name} {index !== kdrama.genres.length - 1 && ","}
                  </Text>
                ))}
                <DotFilledIcon className="w-4 h-4" />
                <Text>{kdrama.number_of_episodes} episodes</Text>
              </HStack>

              <VStack className="gap-2">
                <Text className="font-bold text-xl">Overview</Text>
                <Text className="inline-block">{kdrama.overview}</Text>
              </VStack>

              {kdrama.crew && kdrama.crew.length > 0 && (
                <HStack className="gap-x-32 gap-y-4 items-center">
                  {kdrama.crew.map((crew: any) => {
                    //filter only director and writer and screenplay and original concept
                    if (
                      crew.job !== "Director" &&
                      crew.job !== "Writer" &&
                      crew.job !== "Screenplay" &&
                      crew.job !== "Original Concept"
                    )
                      return null;

                    return (
                      <VStack key={crew.id} className="gap-0">
                        <Text className="font-bold text-lg">{crew.name}</Text>
                        <Text className="text-sm">{crew.job}</Text>
                      </VStack>
                    );
                  })}
                </HStack>
              )}
            </VStack>
          </VStack>
        </HStack>
      </div>
    </div>
  );
}
