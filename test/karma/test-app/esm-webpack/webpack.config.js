const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.esm.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'www', 'esm-webpack'),
    publicPath: '/esm-webpack/',
  },
  mode: 'production',
  optimization: {
    minimize: false,
  },
};
