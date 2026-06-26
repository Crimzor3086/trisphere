/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Midnight Intelligence palette */
        midnight: '#0B1120',
        surface: '#111827',
        card: '#1F2937',
        sidebar: '#0F172A',
        border: '#374151',
        foreground: '#F9FAFB',
        muted: '#9CA3AF',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#F9FAFB',
        },
        secondary: {
          DEFAULT: '#10B981',
          foreground: '#F9FAFB',
        },
        accent: '#8B5CF6',
        registry: '#F59E0B',
        copilot: '#06B6D4',
        highlight: '#F59E0B',
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#38BDF8',
        error: '#EF4444',
      },
      boxShadow: {
        glow: '0 0 40px rgba(59, 130, 246, 0.18)',
        'glow-secondary': '0 0 32px rgba(16, 185, 129, 0.12)',
        'glow-accent': '0 0 32px rgba(139, 92, 246, 0.12)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at center, rgba(59, 130, 246, 0.14), transparent 45%)',
        'midnight-glow': 'radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 40%)',
        'accent-glow': 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.08), transparent 35%)',
      },
    },
  },
  plugins: [],
};
