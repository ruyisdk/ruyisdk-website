/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./docs/**/*.{md,mdx}",
    "./blog/**/*.{md,mdx}",
    "./biweekly/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        emphasis: "var(--emphasis)",
        dark: "var(--dark)",
        deepdark: "var(--deepdark)",
        light: "var(--light)",
        text: "var(--text)",
        subtle: "var(--subtle)",
        divider: "var(--divider)",
        tint: "var(--tintColor)",
      },
      fontFamily: {
        inter: [
          "Geist",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        site: "var(--site-container-width)",
      },
      boxShadow: {
        card: "0 10px 30px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
