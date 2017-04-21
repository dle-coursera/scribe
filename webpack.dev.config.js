var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HotModuleReplacementPluginConfig = new webpack.HotModuleReplacementPlugin();

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/public/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    'babel-polyfill',
    './public/index.js'
  ],
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['react-hot-loader', 'babel-loader?presets[]=es2015,presets[]=react']
      },
      {
        test: /\.(styl|css)$/,
        loaders: ['style-loader', 'css-loader?url=false', 'stylus-loader']
      },
      {
        test: /\.txt$/,
        loaders: ['react-hot-loader', 'raw-loader']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  },
  resolve: {
    alias: { 'react/lib/ReactMount': 'react-dom/lib/ReactMount' },
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    HotModuleReplacementPluginConfig,
    HTMLWebpackPluginConfig,
  ]
};