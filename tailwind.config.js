/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
const plugin = require("tailwindcss/plugin");

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
    plugin(function ({ matchUtilities }) {
      matchUtilities({
        "vt-name": (value) => ({
          viewTransitionName: value,
        }),
      });
    }),
  ],
};
