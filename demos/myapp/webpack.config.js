var webpack = require('webpack');
var path = require('path');


module.exports = {
  entry: {
    app: './dist/app/app.client.js'
  },
  output: {
    filename: './www/build/app.client.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ],
  resolve: {
    alias: {
        'ionic-core': path.resolve(__dirname, '../../ionic-core/dist/es2015/index.js'),
        'ionic-ui': path.resolve(__dirname, '../../ionic-ui/dist/es2015/index.js')
    }
  }
};