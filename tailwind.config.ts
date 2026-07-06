import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wingman Palette
        'vibe-bg': '#09090b',         // Zinc 950
        'vibe-surface': '#18181b',    // Zinc 900
        'vibe-border': '#27272a',     // Zinc 800
        'vibe-accent': '#6366f1',     // Indigo 500 (Primary)
        'vibe-accent-dim': '#4338ca', // Indigo 700
        'vibe-purple': '#8b5cf6',     // Violet 500
        'vibe-cyan': '#06b6d4',       // Cyan 500
        'vibe-text': '#fafafa',       // Zinc 50
        'vibe-muted': '#a1a1aa',      // Zinc 400
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

export default config
