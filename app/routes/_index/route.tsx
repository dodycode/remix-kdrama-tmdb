import {
  defer,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import VStack from "~/components/vstack";
import MovieListHeader from "./movie-list-header";
import MovieList from "./movie-list";
import { Await, useLoaderData } from "@remix-run/react";
import { discoverTVShows } from "~/services/tmdb.server";
import { Suspense, useEffect } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import MovieListHeaderSkeleton from "./movie-list-header-skeleton";
import MovieListSkeleton from "./movie-list-skeleton";

export const meta: MetaFunction = () => {
  return [
    { title: "KDramaFlix" },
    {
      name: "description",
      content: "A Netflix clone for Korean dramas and movies",
    },
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  //get search params
  const url = new URL(request.url);
  const sortBy = url.searchParams.get("sortBy") || "first_air_date.desc";
  const page = url.searchParams.get("page") || 1;

  const APIToken = context.env.THE_MOVIE_DB_ACCESS_TOKEN;

  const kdramas = discoverTVShows(page as number, APIToken, sortBy);

  return defer({
    kdramas,
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const isHydrated = useHydrated();

  if (!isHydrated) return <></>;

  return (
    <main className="w-full px-4 lg:px-0 lg:max-w-4xl mx-auto mt-10">
      <VStack className="gap-y-5 h-[calc(100vh-105px)]">
        <Suspense fallback={<MovieListHeaderSkeleton />}>
          <Await resolve={data.kdramas}>
            {(kdramas) => {
              //@ts-ignore
              if (!kdramas.results) return <MovieListHeaderSkeleton />;
              return <MovieListHeader />;
            }}
          </Await>
        </Suspense>

        <VStack className="flex-1">
          <Suspense fallback={<MovieListSkeleton />}>
            <Await resolve={data.kdramas}>
              {(kdramas) => {
                //@ts-ignore
                if (!kdramas.results) return <div>No data</div>;
                //@ts-ignore
                return <MovieList movies={kdramas.results} />;
              }}
            </Await>
          </Suspense>
        </VStack>
      </VStack>
    </main>
  );
}
