
const { getDefaultBuildConditionals } = require('../dist/transpiled-build-conditionals/build-conditionals');

global.__BUILD_CONDITIONALS__ = getDefaultBuildConditionals();
expect.extend(require('../src/testing/expect'));
