import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import BackdropJumbotron from "./backdrop-jumbotron";
import { useLoaderData } from "@remix-run/react";
import {
  getTVShowCredits,
  getTVShowDetails,
  getTVShowTrailer,
} from "~/services/tmdb.server";
import { useEffect } from "react";
import CastList from "./cast-list";

export const meta: MetaFunction = () => {
  return [
    { title: "KDramaFlix" },
    {
      name: "description",
      content: "A Netflix clone for Korean dramas and movies",
    },
  ];
};

export async function loader({ context, params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const token = context.env.THE_MOVIE_DB_ACCESS_TOKEN;

  const kdrama = await getTVShowDetails(id, token);
  if (!kdrama) return redirect("/");

  const kdramaCredits = await getTVShowCredits(id, token);
  if (!kdramaCredits) return redirect("/");

  const kDramaShows = await getTVShowTrailer(id, token);
  if (!kDramaShows) return redirect("/");

  //find videos that has type "Trailer" in kDramaShows.results
  // @ts-ignore
  const trailer = kDramaShows.results.find((video) => video.type === "Trailer");

  return json({
    kdrama: {
      ...kdrama,
      ...kdramaCredits,
      // @ts-ignore
      trailer: trailer,
    },
  });
}

export default function ShowDetail() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-4 lg:px-0 lg:max-w-5xl mx-auto mt-10">
      <Breadcrumbs className="mb-4" size="lg">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        {/* @ts-ignore */}
        <BreadcrumbItem>{data.kdrama.name}</BreadcrumbItem>
      </Breadcrumbs>
      <BackdropJumbotron kdrama={data.kdrama} />
      <CastList kdrama={data.kdrama} />
    </main>
  );
}
