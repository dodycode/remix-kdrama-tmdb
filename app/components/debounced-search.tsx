import { Image, Input } from "@nextui-org/react";
import { DotFilledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Text from "./text";
import { cn } from "~/lib/cn";
import { computedTheme } from "~/lib/theme-switcher";
import { useFetcher } from "@remix-run/react";
import { IndexLoader } from "~/routes/_index/route";
import { useEffect, useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import { Link } from "@remix-run/react";

import HStack from "./hstack";
import VStack from "./vstack";

type TypeaheadProps = {
  results: any;
  isLoading: boolean;
  search: string;
  genres: any;
};

const imageBaseURL = "https://image.tmdb.org/t/p/w92";

function Typeahead({
  results = [],
  isLoading,
  search,
  genres,
}: TypeaheadProps) {
  const theme = computedTheme();

  //temporary logic, currently we dont have feature to search by original language in TMDB API
  //remove results that are not have original_language === "ko"
  results = results.filter((result: any) => result.original_language === "ko");

  if (!results.length && !isLoading && !search) return <></>;

  return (
    <div
      className={cn(
        "text-sm rounded-md p-2 bg-default-100 text-default-500 w-full shadow-md",
        theme === "light" && "bg-white border"
      )}
    >
      {isLoading ? (
        <Text className="text-center">Loading...</Text>
      ) : results.length ? (
        <VStack className="gap-y-1">
          {results.map((result: any) => {
            const posterPath = `${imageBaseURL}${result.poster_path}`;
            const genre = genres.genres.find(
              (g: any) => g.id === result.genre_ids[0]
            )?.name;

            return (
              <Link
                key={result.id}
                to={`/detail/${result.id}`}
                className="text-default-500 w-full"
                unstable_viewTransition
              >
                <HStack className="gap-2 pb-1">
                  <div className="transition-all duration-300 ease-in-out">
                    <Image
                      src={posterPath}
                      alt={result.name}
                      classNames={{
                        img: "h-full w-full object-cover rounded-md",
                        wrapper: "h-auto w-full rounded-md",
                      }}
                      isBlurred={theme === "dark"}
                      loading="lazy"
                    />
                  </div>
                  <VStack className="flex-1 pt-1 px-2">
                    <Text className="line-clamp-2 font-bold text-small mb-1">
                      {result.name}
                    </Text>

                    <HStack className="gap-x-1 items-center mb-2">
                      <Text className="text-xs font-semibold">{genre}</Text>
                      <DotFilledIcon className="w-3 h-3" />
                      <Text className="text-xs font-semibold">
                        {new Date(result.first_air_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                          }
                        )}
                      </Text>
                    </HStack>

                    {/* overview */}
                    <Text className="text-xs line-clamp-3">
                      {result.overview}
                    </Text>
                  </VStack>
                </HStack>
              </Link>
            );
          })}
        </VStack>
      ) : (
        <Text className="text-center">No results</Text>
      )}
    </div>
  );
}

export default function DebouncedSearch() {
  const fetcher = useFetcher<IndexLoader>();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    fetcher.load(`/?index&search=${debouncedSearch}`);
  }, [debouncedSearch]);

  return (
    <VStack className="relative max-w-full h-10 flex-1 gap-y-2">
      <Input
        classNames={{
          base: "max-w-full h-10",
          mainWrapper: "h-full",
          input: "text-sm",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        placeholder="Type to search..."
        size="sm"
        startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
        type="search"
        radius="sm"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        autoComplete="off"
      />
      <Typeahead
        results={fetcher.data?.searchData?.results}
        genres={fetcher.data?.genres}
        isLoading={fetcher.state === "loading"}
        search={debouncedSearch}
      />
    </VStack>
  );
}
