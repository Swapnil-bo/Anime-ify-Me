/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Core anime card palette
          void: "#0a0a0f",
          "card-bg": "#0f0f1a",
          "card-border": "#1e1e3a",
          crimson: "#e63946",
          "power-blue": "#4cc9f0",
          "soul-gold": "#ffd60a",
          "shadow-purple": "#7b2d8b",
        },
        fontFamily: {
          // For character names and titles
          cinzel: ["Cinzel", "serif"],
          // For body/stats
          rajdhani: ["Rajdhani", "sans-serif"],
        },
        animation: {
          "stat-fill": "statFill 1.2s ease-out forwards",
          "card-reveal": "cardReveal 0.6s ease-out forwards",
          "pulse-glow": "pulseGlow 2s infinite",
        },
        keyframes: {
          statFill: {
            "0%": { width: "0%" },
            "100%": { width: "var(--stat-width)" },
          },
          cardReveal: {
            "0%": { opacity: "0", transform: "translateY(20px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          pulseGlow: {
            "0%, 100%": { opacity: "1" },
            "50%": { opacity: "0.5" },
          },
        },
        boxShadow: {
          "glow-crimson": "0 0 20px rgba(230, 57, 70, 0.4)",
          "glow-blue": "0 0 20px rgba(76, 201, 240, 0.4)",
          "glow-gold": "0 0 20px rgba(255, 214, 10, 0.4)",
        },
      },
    },
    plugins: [],
  }