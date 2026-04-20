import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal green system
        green: {
          primary: "#00ff41",
          glow: "#00d632",
          muted: "#00a52a",
          dim: "#006619",
          ghost: "rgba(0,255,65,0.08)",
        },
        // Background layers
        bg: {
          base: "#030303",
          surface: "#080808",
          elevated: "#0e0e0e",
          panel: "#111111",
          highlight: "#161616",
        },
        // Status
        danger: "#ff3333",
        warning: "#ffaa00",
        info: "#00aaff",
        success: "#00ff41",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
        "scanline": "scanline 8s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "tick": "tick 0.5s ease-in-out",
        "matrix-rain": "matrixRain 20s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.3)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        tick: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        matrixRain: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100vh" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 8px rgba(0,255,65,0.3)",
        "glow-md": "0 0 16px rgba(0,255,65,0.25), 0 0 32px rgba(0,255,65,0.1)",
        "glow-lg": "0 0 24px rgba(0,255,65,0.3), 0 0 48px rgba(0,255,65,0.15)",
        "glow-danger": "0 0 12px rgba(255,51,51,0.3)",
        "glow-warning": "0 0 12px rgba(255,170,0,0.3)",
        "panel": "0 0 0 1px rgba(0,255,65,0.08), 0 4px 24px rgba(0,0,0,0.6)",
        "panel-hover": "0 0 0 1px rgba(0,255,65,0.2), 0 4px 32px rgba(0,0,0,0.8), 0 0 16px rgba(0,255,65,0.08)",
      },
      backgroundImage: {
        "grid-green": "linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)",
        "scanline": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        "glow-radial": "radial-gradient(ellipse at center, rgba(0,255,65,0.06) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
