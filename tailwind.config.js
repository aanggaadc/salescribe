/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        obsidian: {
          50: "#f0f0f5",
          100: "#d9d9e8",
          200: "#b3b3d1",
          300: "#8c8cba",
          400: "#6666a3",
          500: "#40408c",
          600: "#333375",
          700: "#26265e",
          800: "#1a1a47",
          900: "#0d0d30",
          950: "#06061a",
        },
        volt: {
          50: "#f5ffe0",
          100: "#e8ffb3",
          200: "#d4ff66",
          300: "#c1ff1a",
          400: "#adf500",
          500: "#8fd100",
          600: "#72ae00",
          700: "#558a00",
          800: "#386600",
          900: "#1c4300",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 2s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
