/** @type {import('tailwindcss').Config} */
export default {
      content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
            extend: {
                  colors: {
                        glass: "rgba(255, 255, 255, 0.1)",
                        glassBorder: "rgba(255, 255, 255, 0.2)",
                        primary: "#10b981", // Emerald 500
                        danger: "#ef4444", // Red 500
                        warning: "#f59e0b", // Amber 500
                  },
                  backdropBlur: {
                        xs: '2px',
                  }
            },
      },
      plugins: [],
}
