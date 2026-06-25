module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(56, 189, 248, 0.15)',
      },
      backgroundImage: {
        'radial-grid': 'radial-gradient(circle at center, rgba(56, 189, 248, 0.18), transparent 45%)',
      },
    },
  },
  plugins: [],
};
