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
        "button-primary": "#F0F1F4",
        "border-primary": "#EAECF0",
        "form-label": "#344054",
        "border-secondary": "#ececf1",
      },
    },
  },
  plugins: [],
};
