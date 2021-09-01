const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.esm.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'www', 'dist-custom-elements-webpack'),
    publicPath: '/dist-custom-elements-webpack/',
  },
  mode: 'production',
  optimization: {
    minimize: false,
  },
  resolve: {
    alias: {
      '@stencil/core/internal/client': '../../../internal/client',
      '@stencil/core/internal/app-data': '../app-data'
    }
  }
};
