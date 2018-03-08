'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';

const config = {
  devtool: isProd ? false : 'source-map',
  watchOptions: {
    ignored: /node_modules/
  },
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'dist/'),
    port: 3000
  },
  context: path.resolve('./src'),
  entry: {
    main: './index.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./dist'),
    sourceMapFilename: '[name].bundle.map',
    devtoolModuleFilenameTemplate: function(info) {
      return 'file:///' + info.absoluteResourcePath;
    }
  },
  target: 'web',
  stats: isProd ? 'normal' : 'errors-only',
  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        enforce: 'pre',
        test: /\.ts?$/,
        exclude: /'node_modules'/,
        use: ['ts-loader', 'source-map-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    new webpack.optimize.SplitChunksPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      template: '!!ejs-loader!src/index.html',
      title: 'App'
    }),
  ]
};
exports['default'] = config;
