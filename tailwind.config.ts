import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#0e0e0f",
        "primary": "#69daff",
        "primary-container": "#00cffc",
        "secondary": "#ff7524",
        "secondary-container": "#a04100",
        "tertiary": "#89a5ff",
        "tertiary-container": "#7696fd",
        "surface": "#0e0e0f",
        "surface-bright": "#2c2c2d",
        "surface-container": "#1a191b",
        "surface-container-high": "#201f21",
        "surface-container-highest": "#262627",
        "surface-container-low": "#131314",
        "surface-container-lowest": "#000000",
        "on-background": "#ffffff",
        "on-surface": "#ffffff",
        "on-surface-variant": "#adaaab",
        "outline": "#767576",
        "outline-variant": "#484849",
        "error": "#ff716c",
        "error-container": "#9f0519",
      },
      fontFamily: {
        headline: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        label: ["var(--font-inter)", "sans-serif"]
      },
      borderRadius: { DEFAULT: "0px", lg: "0px", xl: "0px", full: "0px" },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
};

export default config;
