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
