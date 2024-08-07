import MovieCard from "./movie-card";
import { useHydrated } from "remix-utils/use-hydrated";
import { forwardRef, useEffect, useState } from "react";
import { useFetcherWithPromise } from "~/hooks/use-promise-fetcher";
import { Link, unstable_useViewTransitionState } from "@remix-run/react";

import { VirtuosoGrid } from "react-virtuoso";

import "./movie-list.css";

export type Movie = {
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  overview: string;
  id: number;
};

type MovieListProps = {
  movies: Movie[];
  genres: any;
  onFetching: (isFetching: boolean) => void;
};

const MovieComponent = {
  List: forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{ style?: React.CSSProperties }>
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexWrap: "wrap",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: React.PropsWithChildren<{}>) => (
    <div
      style={{
        width: "224px",
        height: "420px",
        position: "relative",
      }}
      {...props}
    >
      {children}
    </div>
  ),
};

const RowComponent = ({
  index,
  kdrama,
  genres,
}: {
  index: number;
  kdrama: Movie;
  genres: MovieListProps["genres"];
}) => {
  const to = `/detail/${kdrama.id}`;
  const isTransitioning = unstable_useViewTransitionState(to);

  if (!kdrama) return <></>;

  const genre =
    genres.find(
      //@ts-ignore
      (genre: any) => genre.id === kdrama.genre_ids[0]
    )?.name || "Unknown";

  return (
    <Link
      className="text-default-foreground w-full h-full"
      to={to}
      unstable_viewTransition
    >
      <MovieCard isTransitioning={isTransitioning} genre={genre} {...kdrama} />
    </Link>
  );
};

export default function MovieList({
  movies,
  genres,
  onFetching,
}: MovieListProps) {
  const isHydrated = useHydrated();
  const fetcher = useFetcherWithPromise();

  const [items, setItems] = useState(movies);
  const [page, setPage] = useState(2);
  const [shouldFetch, setShouldFetch] = useState(true);

  const [vKey, setVKey] = useState(0);

  const loadMoreItems = (shouldFetch: boolean) => {
    if (!shouldFetch) return;

    //get current params
    const params = new URLSearchParams(window.location.search);
    const sortBy = params.get("sortBy") || "first_air_date.desc";
    const withGenres = params.get("with_genres") || null;

    // return fetcher.load(`/?index&sortBy=${sortBy}&page=${page}`);

    //set timeout between fetches
    return new Promise<void>((resolve) => {
      onFetching(true);
      fetcher
        .load(
          `/?index&sortBy=${sortBy}&page=${page}${
            withGenres && `&with_genres=${withGenres}`
          }`
        )
        .then(() => {
          resolve();
          onFetching(false);
        });
    });
  };

  const ItemContent = (index: number) => {
    return <RowComponent index={index} kdrama={items[index]} genres={genres} />;
  };

  //map new data to items
  useEffect(() => {
    // Discontinue API calls if the last page has been reached
    if (fetcher.data) {
      //@ts-ignore
      if (fetcher.data.kdramas.results.length === 0) {
        setShouldFetch(false);
      }

      if (fetcher.data) {
        //@ts-ignore
        if (fetcher.data.kdramas.results.length > 0) {
          setItems((prevItems) => [
            ...prevItems,
            //@ts-ignore
            ...fetcher.data.kdramas.results,
          ]);
          setPage(page + 1);
          setShouldFetch(true);
        }
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    //reset items when data filter changes
    setItems(movies);
    setVKey((prev) => prev + 1);
  }, [movies]);

  if (!isHydrated) return <></>;

  return (
    <VirtuosoGrid
      key={vKey}
      totalCount={items.length}
      className="h-screen"
      components={MovieComponent}
      data={items}
      itemContent={ItemContent}
      endReached={() => loadMoreItems(shouldFetch)}
      useWindowScroll={true}
    />
  );
}
