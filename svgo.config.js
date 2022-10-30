/* global module */

module.exports = {
  plugins: [
      {
          name: 'preset-default',
          params: {
              overrides: {
                  removeViewBox: false,
                  collapseGroups: false,
                  cleanupIDs: false,
              },
          },
      },
  ],
};
