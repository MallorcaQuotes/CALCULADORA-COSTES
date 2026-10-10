import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        med: {
          sand: '#FAF8F5',
          cream: '#F4EFEA',
          stone: '#E8E2D9',
          border: '#DDD5C8',
          limestone: '#D4CBBF',
          muted: '#857F75',
          dark: '#1C1F1E',
          olive: '#4A5B47',
          'olive-dark': '#384635',
          sage: '#6D7E6B',
          terracotta: '#A65B43',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
