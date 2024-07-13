import MovieTrailerButton from "./movie-trailer-btn";

export default function MovieTitle({
  name,
  first_air_date,
  trailer,
}: {
  name: string;
  first_air_date: string;
  trailer: any;
}) {
  return (
    <div className="flex gap-x-3 items-center">
      <h1 className="text-3xl font-bold mb-1">
        {name}{" "}
        <span className="font-normal">
          ({new Date(first_air_date).getFullYear()})
        </span>
      </h1>
      <MovieTrailerButton trailer={trailer} />
    </div>
  );
}
