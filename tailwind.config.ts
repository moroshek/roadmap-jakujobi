import type { Config } from 'tailwindcss';

const config: Config = {
  // App Router only; src/pages omitted (Pages Router not used)
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
