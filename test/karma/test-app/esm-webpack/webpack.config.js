const path = require('path');
const { WWW_OUT_DIR } = require('../../constants');

module.exports = {
  entry: path.resolve(__dirname, 'index.esm.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', WWW_OUT_DIR, 'esm-webpack'),
    publicPath: '/esm-webpack/',
  },
  mode: 'production',
  optimization: {
    minimize: false,
  },
};
