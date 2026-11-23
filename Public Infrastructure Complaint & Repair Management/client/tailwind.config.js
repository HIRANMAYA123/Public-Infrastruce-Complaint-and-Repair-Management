/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0E1E34',
          800: '#142D4E', // Primary Deep Navy
          700: '#1D3B64',
          600: '#264A7C',
          50: '#F0F4F9',
        },
        teal: {
          900: '#0D4E49',
          800: '#116C65',
          700: '#168C83', // Secondary Muted Teal
          600: '#1EA399',
          100: '#E6F5F4',
          50: '#F0FAF9',
        },
        surface: {
          bg: '#F7F8FA', // Soft off-white
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F1F5F9',
        },
        charcoal: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          500: '#64748B',
          400: '#94A3B8',
        },
        civic: {
          pending: '#D97706',  // Warm amber
          progress: '#2563EB', // Royal blue
          completed: '#0D9488',// Teal
          resolved: '#059669', // Emerald
          urgent: '#DC2626',   // Muted red
          high: '#EA580C',     // Orange
          medium: '#D97706',   // Amber
          low: '#64748B',      // Slate
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'civic': '0.625rem', // 10px consistent border radius
      }
    },
  },
  plugins: [],
}
