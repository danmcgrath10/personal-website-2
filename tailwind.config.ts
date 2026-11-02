import type { Config } from "tailwindcss";

const config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F0F4FF",
        ink: "#0B1A55",
        muted: "#35427A",
        rule: "#B5C3EA",
        link: "#1846C7",
      },
      fontFamily: {
        sans: ["Verdana", "Tahoma", "Geneva", "sans-serif"],
        chrome: ["var(--font-michroma)", "Verdana", "sans-serif"],
        pixel: ["var(--font-silkscreen)", "monospace"],
      },
    },
  },
} satisfies Config;

export default config;
