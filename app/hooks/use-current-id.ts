import { useMatches } from "@remix-run/react";

export default function useCurrentId(paramName?: string, routeId?: string) {
  if (!paramName) {
    return null;
  }
  const matches = useMatches();

  const currentId =
    matches.find((route) => {
      return route.id === `routes/${routeId}`;
    })?.params[paramName] || null;

  return currentId;
}
