import { Image, Card, CardBody, CardFooter } from "@nextui-org/react";
import Grid from "~/components/grid";
import Text from "~/components/text";

type CastListProps = {
  kdrama: any;
};

const caseProfileBaseURL = "https://image.tmdb.org/t/p/w185";

export default function CastList({ kdrama }: CastListProps) {
  if (!kdrama) return <></>;
  if (!kdrama.cast.length) return <></>;

  return (
    <section className="my-8">
      <Text className="text-4xl font-bold mb-4">Cast</Text>
      <Grid className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
        {kdrama?.cast?.map((cast: any) => (
          <Card shadow="sm" key={cast.cast_id} isPressable>
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="none"
                width="100%"
                alt={cast.original_name}
                loading="lazy"
                className="w-full object-cover h-[200px]"
                src={`${caseProfileBaseURL}${cast.profile_path}`}
              />
            </CardBody>
            <CardFooter className="text-small flex flex-col flex-grow">
              <Text className="font-bold">{cast.original_name}</Text>
              <Text className="text-gray-500">{cast.character}</Text>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </section>
  );
}
