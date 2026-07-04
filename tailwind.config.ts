import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff8833' },
          '50%': { boxShadow: '0 0 15px #00ff88, 0 0 30px #00ff8855' },
        },
      },
    },
  },
  plugins: [],
}

export default config
