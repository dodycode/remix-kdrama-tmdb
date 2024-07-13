import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui(),
    plugin(function ({ matchUtilities }: { matchUtilities: any }) {
      matchUtilities({
        "vt-name": (value: string) => ({
          viewTransitionName: value,
        }),
      });
    }),
  ],
} satisfies Config;
