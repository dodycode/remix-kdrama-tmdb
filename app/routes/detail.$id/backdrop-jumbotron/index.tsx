import { FastAverageColor } from "fast-average-color";
import { Suspense, useEffect, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import HStack from "~/components/hstack";
import JumbotronPoster from "./poster";
import { Await } from "@remix-run/react";
import { Image, Skeleton } from "@nextui-org/react";
import MovieTitle from "./movie-title";
import Text from "~/components/text";
import VStack from "~/components/vstack";
import { DotFilledIcon } from "@radix-ui/react-icons";

const backdropBaseURL = "https://image.tmdb.org/t/p/w1280";

const getImageDominantColor = async (imageUrl: string) => {
  const fac = new FastAverageColor();

  try {
    return await fac.getColorAsync(imageUrl);
  } catch (e) {
    console.error(e);
  }
};

export default function BackdropJumbotron({ kdrama }: { kdrama: any }) {
  const isHydrated = useHydrated();

  const [bgDominantColor, setBgDominantColor] = useState<
    [number, number, number]
  >([0, 0, 0]);

  const setupBgColor = async () => {
    if (!kdrama) return;

    const color = await getImageDominantColor(
      `${backdropBaseURL}${kdrama.backdrop_path}`
    );

    if (color) {
      const [r, g, b] = color.value;
      setBgDominantColor([r, g, b]);
    }
  };

  useEffect(() => {
    setupBgColor();
  }, []);

  if (!isHydrated) return <></>;

  return (
    <div
      className="w-full bg-auto bg-no-repeat bg-center rounded-3xl overflow-hidden"
      style={{
        backgroundImage: kdrama
          ? `url(${backdropBaseURL}${kdrama?.backdrop_path})`
          : "none",
      }}
    >
      <div
        className="p-12 backdrop-blur"
        style={{
          background: `rgba(${[...bgDominantColor, 0.7]})`,
        }}
      >
        <HStack className="gap-8">
          <JumbotronPoster kdrama={kdrama} />

          <VStack className="py-4 gap-2 flex-1">
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
                <Text className="text-white">{kdrama.first_air_date}</Text>
                <DotFilledIcon className="w-4 h-4" />
                {kdrama.genres.map((genre: any, index: number) => (
                  <Text key={genre.id} className="text-white">
                    {genre.name} {index !== kdrama.genres.length - 1 && ","}
                  </Text>
                ))}
                <DotFilledIcon className="w-4 h-4" />
                <Text className="text-white">
                  {kdrama.number_of_episodes} episodes
                </Text>
              </HStack>

              <VStack className="gap-2">
                <Text className="font-bold text-xl text-white">Overview</Text>
                <Text className="text-white inline-block">
                  {kdrama.overview}
                </Text>
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
                        <Text className="font-bold text-white text-lg">
                          {crew.name}
                        </Text>
                        <Text className="text-white text-sm">{crew.job}</Text>
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
