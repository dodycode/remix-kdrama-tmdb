import * as React from "react";
import { useGlobalNavigationState } from "remix-utils/use-global-navigation-state";
import { cn } from "~/lib/cn";

const all = (arr: any, fn: any) => arr.every(fn);

export default function LoadingIndicator() {
  const globalState = useGlobalNavigationState();
  const active = globalState.includes("loading");

  const ref = React.useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = React.useState(true);

  React.useEffect(() => {
    if (!ref.current) return;
    if (active) setAnimationComplete(false);

    Promise.allSettled(
      ref.current.getAnimations().map(({ finished }) => finished)
    ).then(() => !active && setAnimationComplete(true));
  }, [active]);

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? "Loading" : undefined}
      className="fixed inset-x-0 top-0 left-0 z-50 h-1 animate-pulse"
    >
      <div
        ref={ref}
        className={cn(
          "h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-in-out",
          all(globalState, (state: string) => state === "idle") &&
            animationComplete &&
            "w-0 opacity-0 transition-none",
          globalState.includes("submitting") && "w-4/12",
          globalState.includes("loading") && "w-10/12",
          all(globalState, (state: string) => state === "idle") &&
            !animationComplete &&
            "w-full"
        )}
      />
    </div>
  );
}
