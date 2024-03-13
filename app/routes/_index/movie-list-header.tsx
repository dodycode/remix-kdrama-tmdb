import { Select, SelectItem } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Form, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "~/components/header";
import HStack from "~/components/hstack";
import Text from "~/components/text";
import VStack from "~/components/vstack";

export default function MovieListHeader({ genres }: { genres: any }) {
  const submit = useSubmit();

  if (!genres) return <></>;

  return (
    <Form
      method="GET"
      onChange={(e) => {
        submit(e.currentTarget);
      }}
    >
      <HStack className="gap-2 w-full justify-between items-center">
        <HStack className="gap-x-2 items-center hidden md:flex">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <Text className="text-md uppercase flex-1 font-bold flex-shrink-0">
            Discover TV Shows
          </Text>
        </HStack>

        <VStack className="md:hidden">
          <ThemeSwitcher />
        </VStack>

        <HStack className="gap-x-2 items-center w-full ml-auto md:ml-0 lg:w-[418px]">
          <Select
            label="Sort by"
            name="sortBy"
            className="flex-shrink max-w-[150px] lg:max-w-[200px]"
            placeholder="Sort by"
            size="sm"
            radius="sm"
            //get defaultSelectedKeys from the URL
            defaultSelectedKeys={[
              new URL(window.location.href).searchParams.get("sortBy") ||
                "popularity.desc",
            ]}
            onChange={(e) => {
              submit({
                sortBy: e.target.value,
                ...(new URL(window.location.href).searchParams.get(
                  "with_genres"
                ) && {
                  with_genres: new URL(window.location.href).searchParams.get(
                    "with_genres"
                  ),
                }),
              });
            }}
          >
            <SelectItem key="popularity.desc" value="popularity.desc">
              Most Popular
            </SelectItem>
            {/* Less Popular */}
            <SelectItem key="popularity.asc" value="popularity.asc">
              Less Popular
            </SelectItem>
            {/* Highest Rated */}
            <SelectItem key="vote_count.desc" value="vote_count.desc">
              Highest Rated
            </SelectItem>
            {/* Lowest Rated */}
            <SelectItem key="vote_count.asc" value="vote_count.asc">
              Lowest Rated
            </SelectItem>
            {/* Newest */}
            <SelectItem key="first_air_date.desc" value="first_air_date.desc">
              Newest
            </SelectItem>
            {/* Oldest */}
            <SelectItem key="first_air_date.asc" value="first_air_date.asc">
              Oldest
            </SelectItem>
          </Select>
          {/* filter by multple genres */}
          <Select
            label="Genres"
            name="with_genres"
            placeholder="All"
            size="sm"
            radius="sm"
            className="flex-shrink max-w-[150px] lg:max-w-[200px]"
            {...(new URL(window.location.href).searchParams.get(
              "with_genres"
            ) && {
              defaultSelectedKeys: new URL(window.location.href).searchParams
                .get("with_genres")
                ?.split(","),
            })}
            onChange={(e) => {
              submit({
                sortBy:
                  new URL(window.location.href).searchParams.get("sortBy") ||
                  "popularity.desc",
                with_genres: e.target.value,
              });
            }}
            scrollShadowProps={{
              isEnabled: false,
            }}
            selectionMode="multiple"
          >
            {genres.map((genre: any) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}
          </Select>
        </HStack>
      </HStack>
    </Form>
  );
}
