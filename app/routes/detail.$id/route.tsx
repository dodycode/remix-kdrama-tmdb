import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import {
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

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const token = context.env.THE_MOVIE_DB_ACCESS_TOKEN;
  if (!token)
    throw new Error(
      "Oops no API token, please make sure your install this app correctly"
    );

  // Fetch kdrama details, kdrama credits, and kdrama trailers in parallel
  const [kdrama, kdramaCredits, kDramaShows] = await Promise.all([
    getTVShowDetails(id, token),
    getTVShowCredits(id, token),
    getTVShowTrailer(id, token),
  ]).catch((error) => {
    console.error(error);
    return [null, null, null];
  });

  if (!kdrama || !kdramaCredits || !kDramaShows) return redirect("/");

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

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const data = await serverLoader<typeof loader>();
  if (!data.kdrama) return redirect("/");

  const imageUrl = `${imageBaseURL}${data.kdrama.poster_path}`;

  const averageColor = await getAverageColor(imageUrl);

  return {
    ...data,
    ...averageColor,
  };
}

clientLoader.hydrate = true;

export default function ShowDetail() {
  const data = useLoaderData<typeof clientLoader>();

  return (
    <main className="w-full px-4 lg:px-0 lg:max-w-4xl mx-auto mt-10">
      <Breadcrumbs className="mb-4" size="lg">
        <BreadcrumbItem>
          <Link to="/" unstable_viewTransition>
            Home
          </Link>
        </BreadcrumbItem>
        {/* @ts-ignore */}
        <BreadcrumbItem>{data.kdrama.name}</BreadcrumbItem>
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
