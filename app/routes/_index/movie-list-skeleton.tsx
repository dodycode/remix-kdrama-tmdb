import { Skeleton } from "@nextui-org/react";
import Grid from "~/components/grid";
import VStack from "~/components/vstack";

export default function MovieListSkeleton() {
  return (
    <VStack>
      <Grid className="grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
        <Skeleton className="rounded-md">
          <div className="w-full h-80 bg-default-500/20" />
        </Skeleton>
        <Skeleton className="rounded-md">
          <div className="w-full h-80 bg-default-500/20" />
        </Skeleton>
        <Skeleton className="rounded-md">
          <div className="w-full h-80 bg-default-500/20" />
        </Skeleton>
        <Skeleton className="rounded-md">
          <div className="w-full h-80 bg-default-500/20" />
        </Skeleton>
      </Grid>
    </VStack>
  );
}
