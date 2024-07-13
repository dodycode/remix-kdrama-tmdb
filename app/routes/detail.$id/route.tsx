import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@vercel/remix";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import BackdropJumbotron from "./backdrop-jumbotron";
import { Link, useLoaderData } from "@remix-run/react";
import {
  getTVShowCredits,
  getTVShowDetails,
  getTVShowTrailer,
} from "~/services/tmdb.server";
import { getAverageColor } from "fast-average-color-node";
import CastList from "./cast-list";

export const meta: MetaFunction = () => {
  return [
    { title: "KDramaDB" },
    {
      name: "description",
      content: "Korean Drama Database by dodycode",
    },
  ];
};

const backdropBaseURL = "https://image.tmdb.org/t/p/w1280";

const getImageDominantColor = async (imageUrl: string) => {
  try {
    const color = await getAverageColor(imageUrl);
    //return [r, g, b]
    if (!color) throw new Error("No color found");
    return {
      value: [color.value[0], color.value[1], color.value[2]],
      isLight: color.isLight,
    };
  } catch (e) {
    console.error(e);
  }

  return {
    value: [0, 0, 0],
    isLight: false,
  };
};

export async function loader({ context, params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/");

  const token = process.env.THE_MOVIE_DB_ACCESS_TOKEN;
  if (!token)
    throw new Error(
      "Oops no API token, please make sure your install this app correctly"
    );

  const kdrama = await getTVShowDetails(id, token);
  if (!kdrama) return redirect("/");

  const color = await getImageDominantColor(
    //@ts-ignore
    `${backdropBaseURL}${kdrama.backdrop_path}`
  );
  const bgDominantColor = color.value;

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
      bgDominantColor,
      bgColorIsLight: color.isLight,
    },
  });
}

export default function ShowDetail() {
  const data = useLoaderData<typeof loader>();

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
      <BackdropJumbotron kdrama={data.kdrama} />
      <CastList kdrama={data.kdrama} />
    </main>
  );
}
