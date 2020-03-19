module.exports = {
  displayName: "integration tests",
  preset: "jest-puppeteer",
  transform: {},
  transformIgnorePatterns: ["./src", "/node_modules/"],
  reporters: [
    "default",
    [
      "jest-html-reporter", {
        "pageTitle": "Integration Tests Report",
        "outputPath": "./coverage/report.html"
      }
    ]
  ]
};
