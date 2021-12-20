module.exports = {
  plugins: {
    'postcss-preset-env': {
      // https://github.com/csstools/postcss-preset-env
      // stage: 4,
      browsers: 'last 2 versions',
      features: {
        'custom-properties': false,
      },
    },
    'postcss-css-variables': {},
    cssnano: {},
  },
};
