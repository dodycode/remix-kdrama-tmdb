import { Image, Skeleton } from "@nextui-org/react";
import { Await } from "@remix-run/react";
import { Suspense } from "react";

type Movie = {
  poster_path: string;
  name: string;
};

type JumbotronPosterProps = {
  kdrama: Movie;
};

const posterBaseURL = "https://image.tmdb.org/t/p/w500";

export default function JumbotronPoster({ kdrama }: JumbotronPosterProps) {
  const posterPath = `${posterBaseURL}${kdrama.poster_path}`;

  return (
    <div className="grow-0 shrink-0 self-center">
      <Suspense
        fallback={
          <Skeleton className="rounded-2xl">
            <div className="h-[384px] !bg-transparent"></div>
          </Skeleton>
        }
      >
        <Await resolve={kdrama}>
          {(kdrama) => (
            <Image
              className="w-64 shadow-2xl"
              src={posterPath}
              alt={`${kdrama.name} poster`}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}
