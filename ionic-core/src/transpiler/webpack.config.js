var webpack = require('webpack');
var path = require('path');


module.exports = {
  entry: {
    app: path.resolve(__dirname, '../../dist/commonjs/transpiler/index.js')
  },
  output: {
    path: path.join(__dirname, '..', '..', 'dist', 'commonjs'),
    filename: 'transpiler.js',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"dev"'
      }
    })
  ],
  resolve: {
    alias: {
        'ionic-core': path.resolve(__dirname, '../../ionic-core/dist/commonjs/index.js'),
        'ionic-ui': path.resolve(__dirname, '../../ionic-ui/dist/commonjs/index.js'),
        'fs': path.resolve(__dirname, '../../dist/commonjs/transpiler/sys/fs.js'),
        'module': path.resolve(__dirname, '../../dist/commonjs/transpiler/sys/module.js')
    }
  }
};