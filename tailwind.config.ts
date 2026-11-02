import type { Config } from "tailwindcss";

const config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3F5F2",
        ink: "#16211D",
        muted: "#55645E",
        rule: "#D3DAD4",
        spruce: "#0F4C3F",
        "spruce-deep": "#0B3A30",
        mead: "#E2AE4A",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;

export default config;
