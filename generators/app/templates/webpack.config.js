const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "production",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: [
          path.resolve(__dirname, "./src")
        ],
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "ui5-next-loader?sourceRoot=./src&namespace=<%= namespace %>"
          },
          {
            loader: 'babel-loader?sourceRoot=./src'
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      "./src/index.html",
      "./src/manifest.json",
      { from: "./src/i18n", to: "i18n" }
    ])
  ]
};