import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0a0a0c",
        ink: "#111114",
        surface: "#18181c",
        "surface-elevated": "#222229",
        neon: {
          pink: "#ff006e",
          blue: "#3b82f6",
          lavender: "#c084fc",
          lime: "#a3e635",
          cream: "#f5f5dc"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
