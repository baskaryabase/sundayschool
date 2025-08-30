import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define a better color palette with improved secondary color
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          // Adjusted secondary color palette for better visibility on white background
          50: '#f7f7f9',
          100: '#e3e3e8',
          200: '#c7c7d1',
          300: '#a6a6b6',
          400: '#8585a0',
          500: '#636382', // Main secondary color (darker for better readability on white)
          600: '#4c4c65',
          700: '#3d3d51',
          800: '#2e2e3d',
          900: '#212130',
          950: '#18181f',
        },
        // You can also define additional color themes here
      }
    },
  },
  plugins: [
    forms,
  ],
};

export default config;
