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

  if (cachedData) {
    if (Date.now() - cachedData.timestamp < CACHE_TTL) {
      // Data is fresh, return it
      return cachedData.data;
    }
  }

  // If no cache or stale data, fetch from server
  const { data, id } = await serverLoader<typeof loader>();

  //@ts-ignore
  if (!data.kdrama) return redirect("/");

  //@ts-ignore
  const imageUrl = `${imageBaseURL}${data.kdrama.poster_path}`;
  const averageColor = await getAverageColor(imageUrl);

  const newData = {
    ...data,
    ...averageColor,
  };

  // Update cache
  await localforage.setItem(cacheKey, {
    data: newData,
    timestamp: Date.now(),
  });

  // If we had stale data, trigger a background refresh
  if (cachedData && Date.now() - cachedData.timestamp < STALE_TTL) {
    fetch(`/show/${id}?_data=routes/show.$id`)
      .catch(() => {})
      .finally(() => {
        console.log("Cache refreshed in the background");
      });
  }

  return {
    data: newData,
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
