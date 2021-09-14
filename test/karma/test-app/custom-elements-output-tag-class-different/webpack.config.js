const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.esm.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'www', 'custom-elements-output-tag-class-different'),
    publicPath: '/custom-elements-output-tag-class-different/',
  },
  mode: 'production',
  optimization: {
    minimize: false,
  },
  resolve: {
    alias: {
      '@stencil/core/internal/client': '../../../internal/client',
      '@stencil/core/internal/app-data': '../app-data',
    },
  },
};
