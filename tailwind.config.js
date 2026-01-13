const plugin = require("tw-animate-css");

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"], // Adjust paths as needed
  theme: {
    extend: {},
  },
  plugins: [plugin],
};
