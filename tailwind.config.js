// tailwind.config.js

module.exports = {
  content: ["./src/{app,components}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          500: "#0178d4",
        },
      },
    },
  },
  plugins: [],
};
