/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
        "table-text": "#475467",
        "chat-background": "#F3F4F6",
        "light-gray": "#F2F2F2",
        "hover-on-white": "#E5E5E5",

        "grey-50": "#667085",
        "grey-30": "#D0D5DD",

        "black-60": "#101828",
        "black-50": "#1E1E1E",
        "black-25": "#475467",

        "white-30": "#F6F8FB",
      },
      boxShadow: {
        primary: "0px 1px 2px rgba(16, 24, 40, 0.05)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
