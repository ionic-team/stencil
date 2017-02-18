var webpack = require('webpack');
var path = require('path');


module.exports = {
  entry: {
    app: './dist/app/main.client.js'
  },
  output: {
    filename: './www/build/main.client.js'
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
        'ionic-ui': path.resolve(__dirname, '../../ionic-ui/dist/commonjs/index.js')
    }
  }
};