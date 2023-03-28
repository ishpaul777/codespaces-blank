/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F0F1F4",
        "light-white": "rgba(255, 255, 255, 0.17)",
        "hover-primary": "#101827",
        "background-sidebar": "#F9FAFB",
        "background-secondary": "#E7EAF0",
        "button-primary": "#F0F1F4",
        "border-primary": "#EAECF0",
        "button-secondary": "#DDE2E9",
        "form-label": "#344054",
        "border-secondary": "#ececf1",
      },
    },
  },
  plugins: [],
};
