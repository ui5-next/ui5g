const path = require('path');
const OpenUI5Plugin = require("openui5-webpack-plugin");

module.exports = {
  mode: "development",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: ["babel-loader"] }
    ]
  },
  plugins: [
    new OpenUI5Plugin({
      modulePath: "sap/ui5/demo/walkthrough"
    })
  ],
  externals: [
    (ctx, req, cb) => {
      if (req.startsWith("sap/ui/") || req.startsWith("sap/m/")) {
        cb(null, "commonjs " + req);
      } else {
        cb();
      }
    }
  ]
};