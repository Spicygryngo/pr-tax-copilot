import type { Config } from "tailwindcss";

// Design system — dark "encrypted terminal + classified tax file" cockpit.
// Tokens mirror the spec in the build plan (section 5).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#060606",
        card: "#1f1f1f",
        panel: "#252525",
        border: {
          DEFAULT: "#252525",
          strong: "#313131",
        },
        ink: {
          DEFAULT: "#ffffff",
          body: "#e5e5e5",
          muted: "#7a7a7a",
        },
        accent: {
          DEFAULT: "#c5ff4a",
          dim: "#9fd13a",
        },
        status: {
          green: "#c5ff4a",
          yellow: "#f5d76e",
          red: "#ff6b6b",
        },
      },
      borderRadius: {
        // Sharp cards (0px), small 4px on buttons/inputs.
        card: "0px",
        btn: "4px",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "PT Serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter Tight", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontWeight: {
        heading: "300",
      },
    },
  },
  plugins: [],
};

export default config;
