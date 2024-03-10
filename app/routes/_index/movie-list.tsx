import MovieCard from "./movie-card";
import { useHydrated } from "remix-utils/use-hydrated";
import { FixedSizeGrid as Grid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import AutoSizer from "react-virtualized-auto-sizer";

import "./custom-scrollbar.css";

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
  const fetcher = useFetcher();

  const [items, setItems] = useState(movies);
  const [page, setPage] = useState(2);
  const [shouldFetch, setShouldFetch] = useState(true);

  const [responsiveColumnCount, setResponsiveColumnCount] = useState(4);

  const infiniteLoaderRef = useRef(null);

  const loadMoreItems = (shouldFetch: boolean) => {
    if (!shouldFetch) return;

    //get current params
    const params = new URLSearchParams(window.location.search);
    const sortBy = params.get("sortBy") || "first_air_date.desc";

    fetcher.load(`/?index&sortBy=${sortBy}&page=${page}`);
    setShouldFetch(false);
  };

  const Row = ({ columnIndex, rowIndex, style }: any) => {
    const itemsIndex = rowIndex * responsiveColumnCount + columnIndex;

    const kdrama = items[itemsIndex];

    console.log(items);

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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //detect screen size on load
  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    //reset items when new data is passed
    setItems(movies);

    //reset infinite loader
    if (infiniteLoaderRef.current) {
      //@ts-ignore
      infiniteLoaderRef.current.resetloadMoreItemsCache();
    }
  }, [movies, infiniteLoaderRef, responsiveColumnCount]);

  if (!isHydrated) return <></>;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          ref={infiniteLoaderRef}
          isItemLoaded={(index) => index < items.length}
          itemCount={items.length + 1}
          loadMoreItems={() => loadMoreItems(shouldFetch)}
        >
          {({ onItemsRendered, ref }) => (
            <Grid
              className="custom-scrollbar"
              columnCount={responsiveColumnCount}
              columnWidth={width / responsiveColumnCount}
              rowCount={Math.ceil(items.length / responsiveColumnCount)}
              rowHeight={430}
              height={height}
              width={width + 24}
              ref={ref}
              onItemsRendered={(gridProps) => {
                onItemsRendered({
                  overscanStartIndex:
                    gridProps.overscanRowStartIndex * responsiveColumnCount,
                  overscanStopIndex:
                    gridProps.overscanRowStopIndex * responsiveColumnCount,
                  visibleStartIndex:
                    gridProps.visibleRowStartIndex * responsiveColumnCount,
                  visibleStopIndex:
                    gridProps.visibleRowStopIndex * responsiveColumnCount,
                });
              }}
            >
              {Row}
            </Grid>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}
