import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF9F7",
        ink: "#1A1A1A",
        emerald: "#0F3D2E",
        "soft-emerald": "#DCEFE8",
        danger: "#C0392B",
        "soft-red": "#FDECEA"
      },
      boxShadow: {
        card: "0 16px 40px rgba(15, 61, 46, 0.08)",
        soft: "0 12px 24px rgba(26, 26, 26, 0.06)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        sans: ["'Manrope'", "sans-serif"]
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(15, 61, 46, 0.08), transparent 38%), radial-gradient(circle at 80% 0%, rgba(192, 57, 43, 0.06), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.68), rgba(255,255,255,0.22))"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" }
        }
      },
      animation: {
        rise: "rise 600ms ease-out both",
        "pulse-soft": "pulseSoft 3.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
