import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ".flowbite-react/class-list.json",
    "node_modules/flowbite-react/dist/**/*.{js,jsx,ts,tsx,mjs,cjs}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#13283E",
        secondary: "#A6CFFA",
        base: "#8f8c8c",
      },
    },
  },
  plugins: [flowbiteReact],
};
