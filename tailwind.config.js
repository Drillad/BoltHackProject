/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          background: '#f9fafb',
          text: {
            primary: '#111827',
            secondary: '#4b5563',
            muted: '#6b7280'
          },
          card: {
            background: '#ffffff',
            border: '#e5e7eb'
          }
        },
        // Dark mode colors
        dark: {
          background: '#111827',
          text: {
            primary: '#f9fafb',
            secondary: '#e5e7eb',
            muted: '#9ca3af'
          },
          card: {
            background: '#1f2937',
            border: '#374151'
          }
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};