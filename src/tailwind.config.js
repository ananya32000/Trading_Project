// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        highContrast: {
          background: '#000000',
          text: '#ffffff',
        },
        colorblind: {
          background: '#f5f5dc',
          text: '#000000',
        },
      },
    },
  },
  plugins: [],
};
