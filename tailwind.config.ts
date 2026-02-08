import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#992A2B',
                secondary: '#EE6936',
                accent: '#ff6b6b',
                'text-primary': '#2d3748',
                'text-secondary': '#4a5568',
                'bg-primary': '#ffffff',
                'bg-secondary': '#f7fafc',
                'border-color': '#e2e8f0',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #992A2B 0%, #EE6936 100%)',
                'gradient-hover': 'linear-gradient(135deg, #7a2122 0%, #d45a2c 100%)',
            },
            boxShadow: {
                'glow-primary': '0 4px 20px rgba(153, 42, 43, 0.4), 0 8px 30px rgba(238, 105, 54, 0.2)',
                'glow-card': '0 10px 40px rgba(153, 42, 43, 0.2)',
            }
        }
    },
    plugins: [],
};

export default config;
