/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--mf-paper)',
        'paper-2': 'var(--mf-paper-2)',
        stone: 'var(--mf-stone)',
        ink: 'var(--mf-ink)',
        'ink-soft': 'var(--mf-ink-soft)',
        accent: 'var(--mf-accent)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        display: '-0.045em',
        head: '-0.025em',
        mono: '0.14em',
      },
      boxShadow: {
        hard: '4px 6px 0 rgba(27,26,22,0.85)',
        card: '6px 6px 0 var(--mf-ink)',
        cta: '0 6px 24px rgba(0,0,0,0.25)',
      },
      borderColor: {
        hair: 'var(--mf-hair)',
      },
    },
  },
  plugins: [],
};
