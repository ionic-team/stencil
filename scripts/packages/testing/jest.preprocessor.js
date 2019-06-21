
console.warn(`DEPRECATED manually configuring "jest.preprocessor.js"`);
console.warn(`Please remove Jest configurations from "package.json" use the Jest preset config instead.`);
console.warn(`You can still override the preset defaults, but it's best to start with the defaults first.`);
console.warn(`"preset": "@stencil/core/testing"\n\n`);

module.exports = require('./jest-preprocessor');
