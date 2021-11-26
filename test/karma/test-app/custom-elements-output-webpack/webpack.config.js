const path = require('path');
const { WWW_OUT_DIR } = require('../../constants');

module.exports = {
  entry: path.resolve(__dirname, 'index.esm.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', WWW_OUT_DIR, 'custom-elements-output-webpack'),
    publicPath: '/custom-elements-output-webpack/',
  },
  mode: 'production',
  optimization: {
    minimize: false,
  },
  resolve: {
    alias: {
      '@stencil/core/internal/client': '../../../../internal/client',
      '@stencil/core/internal/app-data': '../app-data',
    },
  },
};
