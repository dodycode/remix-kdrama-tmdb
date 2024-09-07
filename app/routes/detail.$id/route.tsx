import {
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import {
  Await,
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
} from "@remix-run/react";

import BackdropJumbotron from "./backdrop-jumbotron";
import {
  getTVShowCredits,
  getTVShowDetails,
  getTVShowTrailer,
} from "~/services/tmdb.server";
import CastList from "./cast-list";
import getAverageColor from "~/lib/get-average-color";
import { useEffect, useState } from "react";
import localforage from "localforage";

export const meta: MetaFunction = () => {
  return [
    { title: "KDramaDB" },
    {
      name: "description",
      content: "Korean Drama Database by dodycode",
    },
  ];
};

const imageBaseURL =
  "https://cors.prasetyodody17.workers.dev/?https://image.tmdb.org/t/p/w300";

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const STALE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

async function fetchData(id: string, token: string) {
  const [kdrama, kdramaCredits, kDramaShows] = await Promise.all([
    getTVShowDetails(id, token),
    getTVShowCredits(id, token),
    getTVShowTrailer(id, token),
  ]).catch((error) => {
    console.error(error);
    return [null, null, null];
  });

  if (!kdrama || !kdramaCredits || !kDramaShows) return null;

  //@ts-ignore
  const trailer = kDramaShows.results.find(
    (video: any) => video.type === "Trailer"
  );

  return {
    kdrama: {
      ...kdrama,
      ...kdramaCredits,
      trailer,
    },
  };
}

// Server-side loader
export async function loader({ params, context }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const token = context.env.THE_MOVIE_DB_ACCESS_TOKEN;
  if (!token)
    throw new Error(
      "Oops no API token, please make sure you install this app correctly"
    );

  const data = await fetchData(id, token);
  return { data, id };
}

// Client-side loader
export async function clientLoader({
  serverLoader,
  params,
}: ClientLoaderFunctionArgs) {
  const cacheKey = `kdrama-${params.id}`;
  const cachedData: any = await localforage.getItem(cacheKey);

  const now = Date.now();

  // Function to fetch and process new data
  const fetchAndProcessData = async () => {
    const { data } = await serverLoader<typeof loader>();
    if (!data?.kdrama) return redirect("/");

    const imageUrl = `${imageBaseURL}${data.kdrama.poster_path}`;
    const averageColor = await getAverageColor(imageUrl);

    const newData = {
      ...data,
      ...averageColor,
    };

    await localforage.setItem(cacheKey, {
      data: newData,
      timestamp: now,
    });

    return newData;
  };

  if (cachedData) {
    const cacheAge = now - cachedData.timestamp;

    if (cacheAge < CACHE_TTL) {
      console.log("Loading from fresh cache");
      return cachedData;
    } else if (cacheAge < STALE_TTL) {
      console.log("Loading from stale cache, refreshing in background");
      // Trigger background refresh
      fetchAndProcessData()
        .catch((err) => console.error("Failed to revalidate stale data", err))
        .finally(() => console.log("Cache refreshed in background"));

      return cachedData;
    }
  }

  // If no cache or expired data, fetch new data
  return {
    data: await fetchAndProcessData(),
  };
}

clientLoader.hydrate = true;

export default function ShowDetail() {
  const kdramaDetails = useLoaderData<typeof clientLoader>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (kdramaDetails.data) {
      setData(kdramaDetails.data);
    }
  }, [kdramaDetails]);

  if (!data)
    return (
      <main className="w-full px-4 lg:px-0 lg:max-w-4xl mx-auto mt-10 flex items-center justify-center">
        Loading details
      </main>
    );

  return (
    <main className="w-full px-4 lg:px-0 lg:max-w-4xl mx-auto mt-10">
      <Breadcrumbs className="mb-4" size="lg">
        <BreadcrumbItem>
          <Link to="/" unstable_viewTransition>
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{data.kdrama?.name}</BreadcrumbItem>
      </Breadcrumbs>
      <BackdropJumbotron
        kdrama={data.kdrama}
        bgDominantColor={data.bgDominantColor}
        bgColorIsLight={data.bgColorIsLight}
      />
      <CastList kdrama={data.kdrama} />
    </main>
  );
}
