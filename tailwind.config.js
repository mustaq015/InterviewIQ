/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        rainbow: {
          red: '#ef4444',
          orange: '#f97316',
          amber: '#f59e0b',
          yellow: '#eab308',
          lime: '#84cc16',
          green: '#22c55e',
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          purple: '#a855f7',
          fuchsia: '#d946ef',
          pink: '#ec4899',
          rose: '#f43f5e',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        'rainbow-gradient': 'linear-gradient(135deg, #ef4444, #f97316, #f59e0b, #84cc16, #22c55e, #06b6d4, #3b82f6, #8b5cf6)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(236, 72, 153, 0.4)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
