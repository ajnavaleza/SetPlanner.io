/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6D28D9",
          dark: "#5B21B6",
          light: "#7C3AED"
        },
        secondary: {
          DEFAULT: "#1F2937",
          dark: "#111827",
          light: "#374151"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
          light: "#60A5FA"
        },
      },
    },
  },
  plugins: [],
} 