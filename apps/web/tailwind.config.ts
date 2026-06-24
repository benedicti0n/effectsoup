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
        // Cohere brand
        "cohere-black": "#000000",
        ink: "#212121",
        "ink-primary": "#17171c",
        "deep-green": "#003c33",
        "dark-navy": "#071829",
        canvas: "#ffffff",
        "soft-stone": "#eeece7",
        "pale-green": "#edfce9",
        "pale-blue": "#f1f5ff",
        hairline: "#d9d9dd",
        "border-light": "#e5e7eb",
        "card-border": "#f2f2f2",
        muted: "#93939f",
        slate: "#75758a",
        "body-muted": "#616161",
        "action-blue": "#1863dc",
        "focus-blue": "#4c6ee6",
        coral: "#ff7759",
        "coral-soft": "#ffad9b",
        "form-focus": "#9b60aa",
        "on-primary": "#ffffff",
        "on-dark": "#ffffff",
        error: "#b30000",
        // Product accent (EffectSoup purple/pink, used sparingly)
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          muted: "#f3e8ff"
        }
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "Arial", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "22px",
        xl: "30px",
        pill: "32px"
      },
      spacing: {
        section: "80px",
        "section-lg": "120px"
      },
      maxWidth: {
        "container": "1280px"
      }
    }
  },
  plugins: []
};

export default config;
