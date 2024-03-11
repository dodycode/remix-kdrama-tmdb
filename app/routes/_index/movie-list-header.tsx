import { Select, SelectItem } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Form, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "~/components/header";
import HStack from "~/components/hstack";
import Text from "~/components/text";
import VStack from "~/components/vstack";

export default function MovieListHeader() {
  const submit = useSubmit();

  return (
    <Form
      method="GET"
      onChange={(e) => {
        submit(e.currentTarget);
      }}
    >
      <HStack className="gap-x-2 w-full justify-between items-center">
        <HStack className="gap-x-2 items-center hidden md:flex">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <Text className="text-md uppercase flex-1 font-bold flex-shrink-0">
            Discover TV Shows
          </Text>
        </HStack>
        <VStack className="lg:hidden">
          <ThemeSwitcher />
        </VStack>
        <Select
          label="Sort by"
          name="sortBy"
          className="flex-shrink max-w-[200px] ml-auto md:ml-0"
          placeholder="Sort by"
          size="sm"
          radius="sm"
          //get defaultSelectedKeys from the URL
          defaultSelectedKeys={[
            new URL(window.location.href).searchParams.get("sortBy") ||
              "popularity.desc",
          ]}
          onChange={(e) => {
            submit({ sortBy: e.target.value });
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
          <SelectItem key="vote_average.desc" value="vote_average.desc">
            Highest Rated
          </SelectItem>
          {/* Lowest Rated */}
          <SelectItem key="vote_average.asc" value="vote_average.asc">
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
      </HStack>
    </Form>
  );
}
