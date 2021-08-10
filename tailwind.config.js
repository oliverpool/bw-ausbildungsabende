// const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{vue,ts}'],
  },
  theme: {
    extend: {
      colors: {
        'blue-bw': '#0088ce',
      },
      minWidth: (theme) => ({
        8: theme('width.8'),
        16: theme('width.16'),
        40: theme('width.40'),
      }),
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
