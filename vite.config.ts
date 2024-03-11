import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy({
      getLoadContext,
    }),
    remix(),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      //@ts-ignore
      plugins: [fixReactVirtualized],
    },
  },
});
