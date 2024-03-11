import MovieCard from "./movie-card";
import { useHydrated } from "remix-utils/use-hydrated";
import { useEffect, useRef, useState } from "react";
import { useFetcherWithPromise } from "~/hooks/use-promise-fetcher";
import VirtualizedGrid from "./virtualized-grid";

export type Movie = {
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  overview: string;
};

type MovieListProps = {
  movies: Movie[];
};

export default function MovieList({ movies }: MovieListProps) {
  const isHydrated = useHydrated();
  const fetcher = useFetcherWithPromise();

  const [items, setItems] = useState(movies);
  const [page, setPage] = useState(2);
  const [shouldFetch, setShouldFetch] = useState(true);

  const [responsiveColumnCount, setResponsiveColumnCount] = useState(4);

  const infiniteLoaderRef = useRef(null);
  const gridRef = useRef(null);

  const loadMoreItems = (shouldFetch: boolean) => {
    if (!shouldFetch) return;

    //get current params
    const params = new URLSearchParams(window.location.search);
    const sortBy = params.get("sortBy") || "first_air_date.desc";

    // return fetcher.load(`/?index&sortBy=${sortBy}&page=${page}`);

    //set timeout between fetches
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        fetcher.load(`/?index&sortBy=${sortBy}&page=${page}`).then(() => {
          resolve();
        });
      }, 1000);
    });
  };

  const Row = ({ columnIndex, rowIndex, style }: any) => {
    const itemsIndex = rowIndex * responsiveColumnCount + columnIndex;

    const kdrama = items[itemsIndex];

    return (
      <div style={style} key={itemsIndex}>
        <MovieCard {...kdrama} />
      </div>
    );
  };

  const handleResize = () => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    if (mediaQuery.matches) {
      setResponsiveColumnCount(2);
    } else {
      setResponsiveColumnCount(4);
    }
  };

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
          console.log(fetcher.data);
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

  //set responsive column count
  useEffect(() => {
    //set initial column count
    handleResize();

    //add event listener for resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    //reset items when new data is passed
    setItems(movies);

    //reset infinite loader
    if (infiniteLoaderRef.current) {
      //@ts-ignore
      infiniteLoaderRef.current.resetloadMoreItemsCache();
    }

    //reset grid
    if (gridRef.current) {
      console.log("scrolling to top");
      //@ts-ignore
      gridRef.current.scrollToItem({ columnIndex: 0, rowIndex: 0 });
    }
  }, [movies, infiniteLoaderRef, responsiveColumnCount, gridRef]);

  if (!isHydrated) return <></>;

  return (
    <VirtualizedGrid
      infiniteLoaderRef={infiniteLoaderRef}
      gridRef={gridRef}
      items={items}
      loadMoreItems={loadMoreItems}
      responsiveColumnCount={responsiveColumnCount}
      Row={Row}
      shouldFetch={shouldFetch}
    />
  );
}
