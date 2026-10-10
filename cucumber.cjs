module.exports = {
  default: {
    paths: ["tests/cucumber/features/**/*.feature"],
    requireModule: ["tsx/cjs"],
    require: [
      "tests/cucumber/support/**/*.ts",
      "tests/cucumber/steps/**/*.ts",
    ],
    format: ["progress"],
  },
};