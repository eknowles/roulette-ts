const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const config = {
  devtool: isProd ? false : 'source-map',

  watchOptions: {
    ignored: /node_modules/
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    compress: true,
    port: 3000,
  },

  context: path.resolve('./src'),

  entry: {
    main: './index.ts',
  },

  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.map',
    devtoolModuleFilenameTemplate: info => 'file:///' + info.absoluteResourcePath
  },

  target: 'web',

  stats: isProd ? 'verbose' : 'normal',

  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
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
      }
    ]
  },

  plugins: [
    new webpack.optimize.SplitChunksPlugin(),
    new HtmlWebpackPlugin({
      title: 'App',
      template: '!!ejs-loader!src/index.html',
      hash: true,
      filename: 'index.html',
    })
  ],
};

module.exports = config;
