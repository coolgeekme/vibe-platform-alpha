import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zinc-950': '#09090b',
        'zinc-900': '#18181b',
        'zinc-800': '#27272a',
        'zinc-700': '#3f3f46',
        'zinc-400': '#a1a1aa',
        'zinc-500': '#71717a',
        'zinc-100': '#f4f4f5',
        'wingman-teal': '#49d1d1',
        'wingman-blue': '#6366f1',
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, #27272a 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
    },
  },
  plugins: [],
}

export default config
