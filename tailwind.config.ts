import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ice: "#E8ECF4", glow: "#8FA8FF", dim: "#8A91A3", line: "rgba(232,236,244,0.14)" },
      fontFamily: { display: ["var(--font-display)", "sans-serif"], sans: ["var(--font-body)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
