import {
  defer,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import VStack from "~/components/vstack";
import MovieListHeader from "./movie-list-header";
import MovieList from "./movie-list";
import { Await, useLoaderData } from "@remix-run/react";
import {
  discoverTVShows,
  getTVShowGenres,
  searchTVShows,
} from "~/services/tmdb.server";
import { Suspense, useEffect, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import MovieListHeaderSkeleton from "./movie-list-header-skeleton";
import MovieListSkeleton from "./movie-list-skeleton";

export type IndexLoader = typeof loader;

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
  const sortBy = url.searchParams.get("sortBy") || "popularity.desc";
  const page = url.searchParams.get("page") || 1;
  const withGenres = url.searchParams.get("with_genres") || "";
  const search = url.searchParams.get("search") || "";

  const APIToken = context.env.THE_MOVIE_DB_ACCESS_TOKEN;

  const kdramas = discoverTVShows(page as number, APIToken, sortBy, withGenres);
  const genres = await getTVShowGenres(APIToken);

  //dummy search data for search bar
  let searchData: any = [];

  if (search) {
    searchData = await searchTVShows(page as number, APIToken, search);
  }

  return defer({
    kdramas,
    genres,
    searchData,
  });
}

const Footer = () => {
  return (
    <div
      className="flex justify-center items-center w-full h-20"
    >
      Loading...
    </div>
  )
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [isFetching, setIsFetching] = useState(false);

  const isHydrated = useHydrated();

  if (!isHydrated) return <></>;

  return (
    <main className="w-full px-4 lg:px-0 lg:max-w-4xl mx-auto mt-4 lg:mt-10">
      <VStack className="gap-y-5 h-[calc(100vh-105px)]">
        <Suspense fallback={<MovieListHeaderSkeleton />}>
          <Await resolve={data.kdramas}>
            {(_) => {
              //@ts-ignore
              if (!data.genres.genres) return <MovieListHeaderSkeleton />;
              //@ts-ignore
              return <MovieListHeader genres={data.genres.genres} />;
            }}
          </Await>
        </Suspense>

        <VStack className="flex-1">
          <Suspense fallback={<MovieListSkeleton />}>
            <Await resolve={data.kdramas}>
              {(kdramas) => {
                //@ts-ignore
                if (!kdramas.results.length) return <div>No results</div>;

                return (
                  <>
                    <MovieList
                      //@ts-ignore
                      genres={data.genres.genres}
                      //@ts-ignore
                      movies={kdramas.results}
                      onFetching={(fetching) => setIsFetching(fetching)}
                    />
                    {isFetching && <Footer />}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </VStack>
      </VStack>
    </main>
  );
}
