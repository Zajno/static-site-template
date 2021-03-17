/* global module, require */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SVGO = require('svgo');
const { extendDefaultPlugins } = SVGO;

module.exports = {
  plugins: extendDefaultPlugins([
    { name: 'removeViewBox', active: false },
    { name: 'collapseGroups', active: false },
  ]),
};
