'use strict';

const common = require('./webpack.config');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: `development`,
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    host: '0.0.0.0',
    compress: true,
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss/,
        use: [
          { loader: `style-loader` },
          {
            loader: `css-loader`,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: `sass-loader`,
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  devtool: `source-map`,
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: path.resolve(__dirname, `../src/template.html`),
      inject: `body`,
    }),
  ],
});
