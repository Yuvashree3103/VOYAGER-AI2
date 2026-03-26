/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        accent: '#F59E0B',
        background: '#F8FAFC',
        ink: '#0F172A',
        // Full blue palette
        'blue-brand': {
          900: '#0a1628',
          800: '#0f2044',
          700: '#1a3a6e',
          600: '#1e4db7',
          500: '#2563eb',
          400: '#3b82f6',
          300: '#93c5fd',
          100: '#dbeafe',
        },
        // Accent colours
        'accent-gold': '#f59e0b',
        'accent-teal': '#0d9488',
        'accent-coral': '#f43f5e',
        // Dark BG tokens
        'bg-dark': '#0a0f1e',
        'bg-card': '#111827',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':
          'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(37,99,235,0.12) 0%, transparent 60%), ' +
          'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(124,58,237,0.10) 0%, transparent 60%)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.4s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        slideUp: { '0%': { transform: 'translateY(40px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(37,99,235,0.4)',
        'glow-gold': '0 0 20px rgba(245,158,11,0.5)',
        'glow-teal': '0 0 20px rgba(13,148,136,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card-hover': '0 16px 48px rgba(37,99,235,0.15)',
      },
      backdropBlur: { 'xs': '4px', 'glass': '20px' },
      borderRadius: { '3xl': '1.5rem', '4xl': '2rem' },
    },
  },
  plugins: [],
}
