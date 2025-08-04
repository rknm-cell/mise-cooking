/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], 
        nanum: ["Nanum", "cursive"],
      },
      colors: {
        // Mise Brand Colors
        mise: {
          // Primary Ocean Colors
          ocean: {
            50: '#f0f9fa',
            100: '#ccf0f3',
            200: '#99e1e7',
            300: '#66d2db',
            400: '#33c3cf',
            500: '#1d7b86', // Primary ocean
            600: '#1a6f79',
            700: '#17636c',
            800: '#14575f',
            900: '#114b52',
            950: '#0e3f45',
          },
          // Warm Yellow Accent
          yellow: {
            50: '#fefef9',
            100: '#fefdf2',
            200: '#fefbe6',
            300: '#fdf9d9',
            400: '#fdf7cc',
            500: '#fcf45a', // Primary yellow
            600: '#e3db51',
            700: '#cac248',
            800: '#b1a93f',
            900: '#989036',
            950: '#7f772d',
          },
          // Ocean Light Variants
          oceanLight: {
            50: '#f8fbfc',
            100: '#eef5f6',
            200: '#ddebf0',
            300: '#cce1ea',
            400: '#bbd7e4',
            500: '#426b70', // Ocean light
            600: '#3b6065',
            700: '#34555a',
            800: '#2d4a4f',
            900: '#263f44',
            950: '#1f3439',
          },
          // Ocean Medium Variants
          oceanMedium: {
            50: '#f0f8f9',
            100: '#d9edf0',
            200: '#b3dbe1',
            300: '#8dc9d2',
            400: '#67b7c3',
            500: '#428a93', // Ocean medium
            600: '#3b7c84',
            700: '#346e75',
            800: '#2d6066',
            900: '#265257',
            950: '#1f4448',
          },
        },
        // Semantic Color System
        brand: {
          primary: '#1d7b86',    // mise-ocean-500
          secondary: '#426b70',   // mise-oceanLight-500
          accent: '#fcf45a',      // mise-yellow-500
          surface: '#428a93',     // mise-oceanMedium-500
        },
        // Status Colors
        status: {
          success: {
            light: '#dcfce7',
            main: '#22c55e',
            dark: '#166534',
          },
          error: {
            light: '#fef2f2',
            main: '#ef4444',
            dark: '#dc2626',
          },
          warning: {
            light: '#fef3c7',
            main: '#f59e0b',
            dark: '#d97706',
          },
          info: {
            light: '#dbeafe',
            main: '#3b82f6',
            dark: '#1d4ed8',
          },
        },
        // Background Gradients
        gradient: {
          primary: 'linear-gradient(to bottom, #1d7b86, #426b70)',
          card: 'linear-gradient(135deg, #428a93, #426b70)',
          accent: 'linear-gradient(135deg, #fcf45a, #f59e0b)',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom, #1d7b86, #426b70)',
        'gradient-card': 'linear-gradient(135deg, #428a93, #426b70)',
        'gradient-accent': 'linear-gradient(135deg, #fcf45a, #f59e0b)',
      },
    },
  },
  plugins: [],
};