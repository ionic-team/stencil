var webpack = require('webpack');
var path = require('path');


module.exports = {
  entry: {
    app: path.resolve(__dirname, '../../dist/es2015/transpiler/index.js')
  },
  output: {
    filename: path.resolve(__dirname, '../../dist/es2015/transpiler.js'),
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
        'ionic-core': path.resolve(__dirname, '../../ionic-core/dist/es2015/index.js'),
        'ionic-ui': path.resolve(__dirname, '../../ionic-ui/dist/commonjs/index.js'),
        'fs': path.resolve(__dirname, '../../dist/es2015/transpiler/sys/fs.js'),
        'module': path.resolve(__dirname, '../../dist/es2015/transpiler/sys/module.js')
    }
  }
};