/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Matches the web vibe-platform-alpha design system
        'vibe-bg': '#0a0a0f',
        'vibe-surface': '#12121a',
        'vibe-border': '#1e1e2e',
        'vibe-accent': '#00ff88',
        'vibe-accent-dim': '#00cc6a',
        'vibe-purple': '#a855f7',
        'vibe-cyan': '#06b6d4',
        'vibe-text': '#e4e4e7',
        'vibe-muted': '#71717a',
      },
      fontFamily: {
        mono: ['JetBrainsMono', 'FiraCode', 'monospace'],
      },
    },
  },
  plugins: [],
};
