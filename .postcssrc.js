const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  // parser: 'sugarss',
  map: false,
  plugins: [
    require('autoprefixer'),
    postcssPresetEnv({
      features: {
        'custom-properties': false,
      }
    }),
  ],
};
