const packageJson = require("./package.json");

module.exports = {
  "sourceRoot": "src",
  "presets": [
    "babel-preset-flow",
    [
      "babel-preset-ui5-next",
      {
        "namespace": packageJson.app.namespace
      }
    ]
  ]
}