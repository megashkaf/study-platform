/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "rgb(from var(--app-border-color) r g b / <alpha-value>)",
            },
        },
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
};
