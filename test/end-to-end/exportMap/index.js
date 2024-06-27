const assert = require('node:assert');

const { version } = require('@stencil/core/compiler');
const { run } = require('@stencil/core/cli');
const { h } = require('@stencil/core');
const { MockDocument } = require('@stencil/core/mock-doc');
const appData = require('@stencil/core/internal/app-data');
const { createNodeLogger } = require('@stencil/core/sys/node')

assert(typeof version === 'string');
assert(typeof run, 'function');
assert(typeof h === 'function');
assert(typeof MockDocument === 'function');
assert(Object.keys(appData).length === 3);
assert(typeof createNodeLogger === 'function');
