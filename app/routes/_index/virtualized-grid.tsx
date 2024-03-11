import { FixedSizeGrid as Grid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

type VirtualizedGridProps = {
  infiniteLoaderRef: React.MutableRefObject<any>;
  gridRef: React.MutableRefObject<any>;
  items: any[];
  loadMoreItems: (shouldFetch: boolean) => void;
  responsiveColumnCount: number;
  Row: any;
  shouldFetch: boolean;
};

export default function VirtualizedGrid({
  infiniteLoaderRef,
  gridRef,
  items,
  loadMoreItems,
  responsiveColumnCount,
  Row,
  shouldFetch,
}: VirtualizedGridProps) {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          ref={infiniteLoaderRef}
          isItemLoaded={(index) => index < items.length}
          itemCount={items.length + 1}
          loadMoreItems={() => loadMoreItems(shouldFetch)}
        >
          {({ onItemsRendered }) => (
            <Grid
              className="custom-scrollbar"
              columnCount={responsiveColumnCount}
              columnWidth={width / responsiveColumnCount}
              rowCount={Math.ceil(items.length / responsiveColumnCount)}
              rowHeight={430}
              height={height}
              width={width + 24}
              ref={gridRef}
              onItemsRendered={(gridProps) => {
                const {
                  visibleRowStartIndex,
                  visibleRowStopIndex,
                  visibleColumnStopIndex,
                  overscanRowStartIndex,
                  overscanRowStopIndex,
                  overscanColumnStopIndex,
                } = gridProps;

                const endCol = visibleColumnStopIndex + 1;
                const endColOverscan = overscanColumnStopIndex + 1;

                const visibleStartIndex = visibleRowStartIndex * endCol;
                const visibleStopIndex = visibleRowStopIndex * endCol;

                const overscanStartIndex =
                  overscanRowStartIndex * endColOverscan;
                const overscanStopIndex = overscanRowStopIndex * endColOverscan;

                onItemsRendered({
                  visibleStartIndex: visibleStartIndex,
                  visibleStopIndex: visibleStopIndex,
                  overscanStartIndex: overscanStartIndex,
                  overscanStopIndex: overscanStopIndex,
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
