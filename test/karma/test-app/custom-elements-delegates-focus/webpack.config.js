const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.esm.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'www', 'custom-elements-delegates-focus'),
    publicPath: '/custom-elements-delegates-focus/',
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
