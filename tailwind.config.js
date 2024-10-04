/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1DA1F2",
        secondary: "#14171A",
      },
      fontFamily: {
        sans: ["pretendardMedium", "Helvetica", "Arial", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      scrollbar: ["hidden"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
