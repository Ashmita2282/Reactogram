// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all relevant files in the src directory
  ],
  theme: {
    extend: {},
  },

  plugins: [require("@tailwindcss/line-clamp")],

  plugins: [require("tailwind-scrollbar-hide")],
};
