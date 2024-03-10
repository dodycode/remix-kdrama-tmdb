import { Skeleton } from "@nextui-org/react";
import HStack from "~/components/hstack";

export default function MovieListHeaderSkeleton() {
  return (
    <HStack className="gap-x-2 w-full justify-between items-center px-2">
      <HStack className="gap-x-2 items-center">
        <Skeleton className="rounded-md">
          <div className="w-5 h-5 bg-default-500/20" />
        </Skeleton>
        <Skeleton className="flex-1 rounded-md">
          <div className="w-20 h-5 bg-default-500/20" />
        </Skeleton>
      </HStack>
      <Skeleton className="rounded-md">
        <div className="w-20 h-5 bg-default-500/20" />
      </Skeleton>
    </HStack>
  );
}
