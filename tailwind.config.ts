import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A2647",
        "primary-light": "#144272",
        accent: "#205295",
        "accent-light": "#2C74B3",
        highlight: "#00D4FF",
        red: "#C0392B",
        "red-light": "#E74C3C",
        "bg-dark": "#050A14",
        "bg-card": "rgba(20, 66, 114, 0.15)",
        "text-main": "#E8E8E8",
        "text-muted": "#A0AEC0",
        border: "rgba(44, 116, 179, 0.3)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInRight: {
          from: { opacity: "0", transform: "translateX(40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0.25" },
        },
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out",
        fadeInRight: "fadeInRight 1s ease-out 0.3s both",
        float: "float 6s ease-in-out infinite",
        floatSlow: "float 12s ease-in-out infinite",
        pulse: "pulse 8s ease-in-out infinite",
        gradientFlow: "gradientFlow 6s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
