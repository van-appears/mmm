const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

// from https://stackoverflow.com/a/76904811
const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry: {
    app: './src/index.js',
  },
  output: {
    hashFunction: 'sha256',
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.png$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};
