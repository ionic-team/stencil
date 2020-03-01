module.exports = {
  "preset": "./testing/jest-preset.js",
  "moduleNameMapper": {
    "@app-data": "<rootDir>/internal/app-data/index.js",
    "@app-globals": "<rootDir>/internal/app-globals/index.js",
    "@platform": "<rootDir>/internal/testing/index.js",
    "@runtime": "<rootDir>/internal/testing/index.js",
    "@stencil/core/compiler": "<rootDir>/compiler/index.js",
    "@stencil/core/mock-doc": "<rootDir>/mock-doc/index.js",
    "@stencil/core/testing": "<rootDir>/testing/index.js",
    "@utils": "<rootDir>/src/utils"
  },
  "modulePathIgnorePatterns": [
    "/bin",
    "/scripts",
    "/www"
  ],
  "testPathIgnorePatterns": [
    "<rootDir>/.cache/",
    "<rootDir>/.github/",
    "<rootDir>/.stencil/",
    "<rootDir>/.vscode/",
    "<rootDir>/bin/",
    "<rootDir>/build/",
    "<rootDir>/cli/",
    "<rootDir>/compiler/",
    "<rootDir>/dev-server/",
    "<rootDir>/dist/",
    "<rootDir>/internal/",
    "<rootDir>/mock-doc/",
    "<rootDir>/node_modules/",
    "<rootDir>/screenshot/",
    "<rootDir>/scripts/",
    "<rootDir>/sys/",
    "<rootDir>/test/",
    "<rootDir>/testing/"
  ],
  "testRegex": "/src/.*\\.spec\\.(ts|tsx|js)$"
};
