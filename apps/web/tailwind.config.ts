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
        // Brand
        ink: "#201d1d",
        "ink-deep": "#0f0000",
        charcoal: "#302c2c",
        body: "#424245",
        mute: "#646262",
        stone: "#6e6e73",
        ash: "#9a9898",
        canvas: "#fdfcfc",
        "surface-soft": "#f8f7f7",
        "surface-card": "#f1eeee",
        "surface-dark": "#201d1d",
        "surface-dark-elevated": "#302c2c",
        hairline: "rgba(15,0,0,0.12)",
        "hairline-strong": "#646262",
        "on-dark": "#fdfcfc",
        "on-dark-mute": "#9a9898",
        // Semantic
        accent: "#007aff",
        "accent-hover": "#0056b3",
        "accent-active": "#004085",
        warning: "#ff9f0a",
        "warning-hover": "#cc7f08",
        "warning-active": "#995f06",
        danger: "#ff3b30",
        "danger-hover": "#d70015",
        "danger-active": "#a50011",
        success: "#30d158",
        // Legacy neon aliases (kept for gradual migration)
        neon: {
          pink: "#ff006e",
          blue: "#3b82f6",
          lavender: "#c084fc",
          lime: "#a3e635",
          cream: "#f5f5dc"
        }
      },
      fontFamily: {
        // Berkeley Mono is the design intent; JetBrains Mono is the open-source substitute.
        mono: [
          "Berkeley Mono",
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ],
        sans: ["JetBrains Mono", "IBM Plex Mono", "ui-monospace", "monospace"]
      },
      borderRadius: {
        sm: "4px"
      },
      spacing: {
        section: "96px"
      }
    }
  },
  plugins: []
};

export default config;
